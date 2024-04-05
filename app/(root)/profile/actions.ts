"use server";

import { auth } from "@/auth";
import { processBio, processSlogan, processSlug, processSocialMediaLink, processVideoUrl } from "@/lib/textOperations";
import { z } from "zod";
import prisma from "@/prisma/client";
import { minio } from "@/minio/client";
import { validate as uuidValidate } from "uuid";
import { v4 as uuidv4 } from "uuid";

export async function editSocials(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
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
	});

	const candidateId = formData.get("id");
	const sessionCandidateId = session.user.candidate.id;
	if (candidateId !== sessionCandidateId) return { ok: false, message: "Unauthorized" };

	const selectedElection = await prisma.election.findFirst({
		where: {
			Candidate: {
				some: {
					id: candidateId as string,
				},
			},
		},
	});

	if (!selectedElection.edit_socials) return { ok: false, message: "You can't edit your social media details" };

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
		return { ok: false, message: "An error occurred while editing social media details" };
	}
	return { ok: true, message: "Social media details edited successfully" };
}

export async function editVideo(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		video_url: z
			.string()
			.max(11, "Video URL can't be longer than 11 characters")
			.min(11, "Video URL can't be shorter than 11 characters")
			.transform((v) => processVideoUrl(v))
			.transform((v) => (v ? v : null))
			.optional(),
	});

	const candidateId = formData.get("id");
	const sessionCandidateId = session.user.candidate.id;
	if (candidateId !== sessionCandidateId) return { ok: false, message: "Unauthorized" };

	const selectedElection = await prisma.election.findFirst({
		where: {
			Candidate: {
				some: {
					id: candidateId as string,
				},
			},
		},
	});

	if (!selectedElection.edit_socials) return { ok: false, message: "You can't edit your video" };

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
		return { ok: false, message: "An error occurred while editing the campaign video" };
	}
	return { ok: true, message: "Campaign video edited successfully" };
}

export async function editSlogan(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		slogan: z
			.string()
			.max(100, "Slogan can't be longer than 100 characters")
			.transform((v) => processSlogan(v))
			.transform((v) => (v ? v : null))
			.optional(),
	});

	const candidateId = formData.get("id");
	const sessionCandidateId = session.user.candidate.id;
	if (candidateId !== sessionCandidateId) return { ok: false, message: "Unauthorized" };

	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				Candidate: {
					some: {
						id: candidateId as string,
					},
				},
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred while editing slogan" };
	}

	if (!selectedElection.edit_slogan) return { ok: false, message: "You can't edit your campaign" };

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
		return { ok: false, message: "An error occurred while editing slogan" };
	}
	return { ok: true, message: "Slogan edited successfully" };
}

export async function editBio(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		bio: z
			.string()
			.max(750, "Bio can't be longer than 750 characters")
			.transform((v) => processBio(v))
			.transform((v) => (v ? v : null))
			.optional(),
	});

	const candidateId = formData.get("id");
	const sessionCandidateId = session.user.candidate.id;
	if (candidateId !== sessionCandidateId) return { ok: false, message: "Unauthorized" };

	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				Candidate: {
					some: {
						id: candidateId as string,
					},
				},
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred while editing slogan" };
	}

	if (!selectedElection.edit_bio) return { ok: false, message: "You can't edit your bio" };

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
		return { ok: false, message: "An error occurred while editing bio" };
	}
	return { ok: true, message: "Bio edited successfully" };
}

export async function addCandidateAnswers(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };

	const candidateId = formData.get("candidateId") as string;
	const sessionCandidateId = session.user.candidate.id;

	if (candidateId !== sessionCandidateId) return { ok: false, message: "Unauthorized" };

	const electionYear = formData.get("electionYear") as string;
	const formDataEntries = Array.from(formData.entries());

	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				Candidate: {
					some: {
						id: candidateId,
					},
				},
				election_year: electionYear,
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred while adding answers" };
	}

	if (!selectedElection.edit_questions) return { ok: false, message: "You can't edit your answers" };

	const answersArray = formDataEntries
		.filter(([key]) => key !== "electionYear" && key !== "candidateId")
		.map(([key, value]) => {
			return { question_id: key, answer: value as string };
		})
		.filter(({ answer }) => answer.trim().length > 0);

	try {
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
	} catch (e) {
		return { ok: false, message: "An error occurred while adding answers" };
	}

	return { ok: true, message: "Answers added successfully" };
}

export async function uploadProfilePicture(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session?.user?.candidate) return { ok: false, message: "Unauthorized" };
	const id = formData.get("id");
	const photo = formData.get("photo") as File;
	if (!uuidValidate(id)) return { ok: false, message: "Invalid candidate ID" };
	if (!photo) return { ok: false, message: "Photo is required" };
	if (!(session?.user?.candidate?.id == id)) return { ok: false, message: "Unauthorized" };

	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				Candidate: {
					some: {
						id: id as string,
					},
				},
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the photo" };
	}
	if (!selectedElection.edit_photo) return { ok: false, message: "You can't delete your photo" };
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
	if (!session?.user?.candidate) return { ok: false, message: "Unauthorized" };
	if (!uuidValidate(candidateId)) return { ok: false, message: "Invalid candidate ID" };
	if (!(session?.user?.candidate?.id == candidateId)) return { ok: false, message: "Unauthorized" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				Candidate: {
					some: {
						id: candidateId,
					},
				},
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the photo" };
	}
	if (!selectedElection.edit_photo) return { ok: false, message: "You can't delete your photo" };
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
