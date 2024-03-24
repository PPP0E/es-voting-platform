"use server";

import { isVotingRunning } from "@/lib/isVotingRunning";
import { nameCase } from "@/lib/nameCase";
import prisma from "@/prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { processSlogan, processBio, processSocialMediaLink, processVideoUrl, processSlug } from "@/lib/textOperations";
import { minio } from "@/minio/client";
import { validate as uuidValidate } from "uuid";
import { auth } from "@/auth";

export async function editFaq(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		title: z.string({ required_error: "Title is required" }).min(1).max(100, "Title can't be longer than 100 characters").trim(),
		content: z.string({ required_error: "Content is required" }).min(10, "Content can't be shorter than 10 characters").max(500, "Content can't be longer than 500 characters").trim(),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const { id, ...data } = parsedData;
	await prisma.faq.update({ where: { id }, data });
	return { ok: true, message: "Faq edited successfully" };
}

export async function addCandidate(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		officialName: z.string({ required_error: "First name is required" }).trim().min(1).max(50, "First name can't be longer than 50 characters"),
		officialSurname: z.string({ required_error: "Last name is required" }).trim().min(1).max(50, "Last name can't be longer than 50 characters"),
		student_id: z.string({ required_error: "Student ID is required" }).regex(/^\d{2}[1-7]\d{3}$/, "Invalid student ID"),
		electionYear: z
			.string({ required_error: "Election year is required" })
			.min(4)
			.max(4)
			.regex(/^\d{4}$/, "Invalid election year"),
		type: z.enum(["GIRL", "BOY"]),
	});
	let parsedData: any, selectedElection: any;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	try {
		selectedElection = await prisma.election.findFirst({ where: { election_year: parsedData.electionYear }, include: { _count: { select: { Candidate: true } } } });
	} catch (e) {
		return { ok: false, message: "An error occurred while adding the candidate" };
	}
	if (!selectedElection) {
		return { ok: false, message: "Election not found" };
	}
	if (selectedElection._count.Candidate > 24) {
		return { ok: false, message: "You can't add more than 25 Candidates to an election." };
	}
	const isElectionRunning = isVotingRunning(selectedElection);
	if (isElectionRunning) {
		return { ok: false, message: "You can't add candidates to an election that is running" };
	}
	if (selectedElection.publish_results) {
		return { ok: false, message: "You can't add candidates to an election that has published results, delete all the results to do so." };
	}
	if (selectedElection.blocked) return { ok: false, message: "You can't add candidates to an election which has votes collected, please delete all votes first." };
	const { electionYear, ...data } = parsedData;
	try {
		await prisma.candidate.create({ data: { election: { connect: { election_year: electionYear } }, officialName: nameCase(data.officialName), officialSurname: nameCase(data.officialSurname), student_id: `s${data.student_id}`, type: data.type } });
	} catch (e) {
		return { ok: false, message: "An error occurred while adding the candidate" };
	}
	return { ok: true, message: "Candidate added successfully" };
}

export async function deleteCandidate(userId) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
	});
	let parsedData: any;
	try {
		await deleteProfilePicture(userId);
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the candidate. (P2)" };
	}
	try {
		parsedData = schema.parse({ id: userId });
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const selectedElection = await prisma.election.findFirst({ where: { Candidate: { some: { id: parsedData.id } } } });
	if (!selectedElection) {
		return { ok: false, message: "Candidate or election not found." };
	}
	const isElectionRunning = isVotingRunning(selectedElection);
	if (isElectionRunning) {
		return { ok: false, message: "You can't delete of an ongoing election." };
	}
	if (selectedElection.publish_results) {
		return { ok: false, message: "You can't delete candidates of an election that has published results, stop the election and delete all results first." };
	}
	if (selectedElection.blocked) return { ok: false, message: "You can't delete candidates of an election which has votes collected, stop the election and delete all votes first." };
	try {
		await prisma.candidate.delete({ where: { id: parsedData.id } });
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the candidate" };
	}
	return { ok: true, message: "Candidate deleted successfully" };
}

export async function editCandidate(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		officialName: z.string({ required_error: "First name is required" }).trim().min(1).max(50, "First name can't be longer than 50 characters"),
		officialSurname: z.string({ required_error: "Last name is required" }).trim().min(1).max(50, "Last name can't be longer than 50 characters"),
		student_id: z
			.string()
			.transform((v) => `s${v}`)
			.pipe(z.string().regex(/^s\d{6}$/, "Invalid student ID")),
		type: z.enum(["BOY", "GIRL"]),
		slogan: z
			.string()
			.max(100, "Slogan can't be longer than 100 characters")
			.transform((v) => processSlogan(v))
			.transform((v) => (v ? v : null))
			.optional(),
		instagram: z
			.string()
			.max(100, "Instagram username can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, "instagram.com/"))
			.transform((v) => (v ? v : null))
			.optional(),
		facebook: z
			.string()
			.max(100, "Facebook username can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, "facebook.com/"))
			.transform((v) => (v ? v : null))
			.optional(),
		twitter: z
			.string()
			.max(100, "Twitter username can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, "twitter.com/"))
			.transform((v) => (v ? v : null))
			.optional(),
		bereal: z
			.string()
			.max(100, "Bereal username can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, "bere.al/"))
			.transform((v) => (v ? v : null))
			.optional(),
		snapchat: z
			.string()
			.max(100, "Snapchat username can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, "snapchat.com/"))
			.transform((v) => (v ? v : null))
			.optional(),
		website: z
			.string()
			.max(100, "Website URL can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, ""))
			.transform((v) => (v ? v : null))
			.optional(),
		youtube: z
			.string()
			.max(100, "Youtube username can't be longer than 100 characters")
			.transform((v) => processSocialMediaLink(v, "youtube.com/"))
			.transform((v) => (v ? v : null))
			.optional(),
		video_url: z
			.string()
			.max(11, "Video URL can't be longer than 11 characters")
			.transform((v) => processVideoUrl(v))
			.transform((v) => (v ? v : null))
			.optional(),
		speech_url: z
			.string()
			.max(11, "Speech URL can't be longer than 11 characters")
			.transform((v) => processVideoUrl(v))
			.transform((v) => (v ? v : null))
			.optional(),
		slug: z
			.string()
			.max(100, "Slug can't be longer than 100 characters")
			.transform((v) => processSlug(v))
			.transform((v) => (v ? v : null))
			.optional(),
		bio: z
			.string()
			.max(750, "Bio can't be longer than 750 characters")
			.transform((v) => processBio(v))
			.transform((v) => (v ? v : null))
			.optional(),
	});

	let parsedData: any;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const { id, ...data } = parsedData;
	try {
		await prisma.candidate.update({ where: { id }, data: data });
	} catch (e) {
		return { ok: false, message: "An error occurred while editing the candidate" };
	}
	return { ok: true, message: "Candidate edited successfully" };
}

export async function uploadProfilePicture(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	const id = formData.get("id");
	const photo = formData.get("photo") as File;
	if (!uuidValidate(id)) return { ok: false, message: "Invalid candidate ID" };
	if (!photo) return { ok: false, message: "Photo is required" };

	if (photo.size > 10000000) return { ok: false, message: "The maximum file size is 10MB" };
	if (!photo.type.includes("image")) return { ok: false, message: "File is not an image" };
	if (photo.type !== "image/jpeg" && photo.type !== "image/png" && photo.type !== "image/gif") return { ok: false, message: "Supported image types are JPEG, PNG, and GIF" };

	const data = await photo.arrayBuffer();
	const buffer = Buffer.from(data);

	const randomUUID = uuidv4();
	const fileName = randomUUID + "." + photo.type.split("/")[1] || "";
	const minioClient = minio();

	try {
		await prisma.$transaction(
			async (tx) => {
				await deleteProfilePicture(id);
				await minioClient.putObject("eselections.org", `avatars/${fileName}`, buffer, null, {
					"Content-Type": photo.type,
				});
				await tx.candidate.update({ where: { id }, data: { photo: fileName } });
			},
			{
				maxWait: 5000,
				timeout: 900000,
			}
		);
	} catch (e) {
		return { ok: false, message: "An error occurred while uploading the photo" };
	}
	return { ok: true, message: "Photo uploaded successfully" };
}

export async function deleteProfilePicture(candidateId) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!uuidValidate(candidateId)) return { ok: false, message: "Invalid candidate ID" };
	const minioClient = minio();
	try {
		await prisma.$transaction(
			async (tx) => {
				const candidateAvatar = await tx.candidate.findUnique({ where: { id: candidateId }, select: { photo: true } });
				if (!candidateAvatar) return { ok: false, message: "Candidate not found" };
				const avatar = candidateAvatar.photo;
				await minioClient.removeObject("eselections.org", `avatars/${avatar}`);
				await tx.candidate.update({ where: { id: candidateId }, data: { photo: null } });
			},
			{
				maxWait: 5000,
				timeout: 900000,
			}
		);
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the photo" };
	}
	return { ok: true, message: "Photo deleted successfully" };
}

export async function addCandidateAnswers(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };

	const electionYear = formData.get("electionYear") as string;
	const candidateId = formData.get("candidateId") as string;

	const formDataEntries = Array.from(formData.entries());
	const answersArray = formDataEntries
		.filter(([key]) => key !== "electionYear" && key !== "candidateId")
		.map(([key, value]) => {
			return { question_id: key, answer: value as string };
		})
		.filter(({ answer }) => answer.trim().length > 0);

	await prisma.$transaction([
		prisma.answer.deleteMany({ where: { candidate: { id: candidateId, election: { election_year: electionYear } } } }),
		...answersArray.map((answer) =>
			prisma.answer.create({
				data: {
					candidate: { connect: { id: candidateId } },
					question: { connect: { id: answer.question_id } },
					content: answer.answer,
				},
			})
		),
	]);

	return { ok: true, message: "Answers added successfully" };
}
