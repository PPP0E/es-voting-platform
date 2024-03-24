"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { z } from "zod";

export async function moveUp(id: string, electionYear: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!id) {
		return { ok: false, message: "Question not found" };
	}
	if (!electionYear || electionYear.length !== 4) {
		return { ok: false, message: "Election year not found" };
	}
	const selectedQuestion = await prisma.question.findUnique({ where: { id } });
	const currentQuestions = await prisma.question.findMany({ where: { election: { election_year: electionYear } }, orderBy: { index: "asc" } });
	const previousQuestion = currentQuestions[selectedQuestion.index - 1];
	if (!selectedQuestion || selectedQuestion.index === 0) {
		return { ok: false, message: "Question not found" };
	}
	try {
		await prisma.$transaction([prisma.question.update({ where: { id, election: { election_year: electionYear } }, data: { index: selectedQuestion.index - 1 } }), prisma.question.update({ where: { id: previousQuestion.id }, data: { index: selectedQuestion.index } })]);
	} catch (e) {
		return { ok: false, message: "An error occurred while moving the question." };
	}
	return { ok: true, message: "Question moved successfully" };
}

export async function moveDown(id: string, electionYear: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!id) {
		return { ok: false, message: "Question not found" };
	}
	if (!electionYear || electionYear.length !== 4) {
		return { ok: false, message: "Election year not found" };
	}
	const selectedQuestion = await prisma.question.findUnique({ where: { id } });
	const currentQuestions = await prisma.question.findMany({ where: { election: { election_year: electionYear } }, orderBy: { index: "asc" } });
	const nextQuestion = currentQuestions[selectedQuestion.index + 1];
	if (!selectedQuestion) {
		return { ok: false, message: "Question not found" };
	}
	if (selectedQuestion.index === currentQuestions.length - 1) {
		return { ok: false, message: "Question is already at the bottom" };
	}
	try {
		await prisma.$transaction([prisma.question.update({ where: { id, election: { election_year: electionYear } }, data: { index: selectedQuestion.index + 1 } }), prisma.question.update({ where: { id: nextQuestion.id }, data: { index: selectedQuestion.index } })]);
	} catch (e) {
		return { ok: false, message: "An error occurred while moving the question" };
	}
	return { ok: true, message: "Question moved successfully" };
}

export async function deleteQuestion(id: string, electionYear: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let currentQuestions;
	try {
		currentQuestions = await prisma.question.findMany({ where: { election: { election_year: electionYear } }, orderBy: { index: "asc" } });
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the question" };
	}
	try {
		await prisma.$transaction([
			prisma.question.delete({
				where: {
					id: id,
				},
			}),
			...currentQuestions.filter((question) => question.id !== id).map((question, index) => prisma.question.update({ where: { id: question.id, election: { election_year: electionYear } }, data: { index } })),
		]);
	} catch (e) {
		console.log(e);
		return { ok: false, message: "An error occurred while deleting the question" };
	}
	return { ok: true, message: "Question deleted successfully" };
}

export async function editQuestion(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		title: z.string({ required_error: "Title is required" }).min(1).max(100, "Title can't be longer than 100 characters").trim(),
		content: z
			.string()
			.trim()
			.max(500, "Content can't be longer than 500 characters")
			.optional()
			.nullable()
			.default(null)
			.transform((v) => (v === undefined ? null : v)),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const { id, ...data } = parsedData;
	await prisma.question.update({ where: { id }, data });
	return { ok: true, message: "Question edited successfully" };
}

export async function addQuestion(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		title: z.string({ required_error: "Title is required" }).min(1).max(100, "Title can't be longer than 100 characters").trim(),
		electionYear: z.string().min(4).max(4),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}

	const currentQuestions = await prisma.question.findMany({ where: { election: { election_year: parsedData.electionYear } }, orderBy: { index: "asc" } });
	if (currentQuestions.length > 9) {
		return { ok: false, message: "You can't add more than 10 Questions" };
	}
	await prisma.question.create({ data: { title: parsedData.title, content: parsedData.content, index: currentQuestions.length, election: { connect: { election_year: parsedData.electionYear } } } });
	return { ok: true, message: "Question added successfully" };
}
