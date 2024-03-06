"use server";

import { isVotingRunning } from "@/lib/isVotingRunning";
import { nameCase } from "@/lib/nameCase";
import prisma from "@/prisma/client";
import { z } from "zod";

export async function editFaq(formData: FormData) {
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
	let schema = z.object({
		id: z.string().uuid(),
	});
	let parsedData: any;
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
