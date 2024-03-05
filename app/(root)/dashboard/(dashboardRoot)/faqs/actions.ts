"use server";

import prisma from "@/prisma/client";
import { z } from "zod";

export async function moveUp(id: string) {
	const selectedFaq = await prisma.faq.findUnique({ where: { id } });
	const currentFaqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	const previousFaq = currentFaqs[selectedFaq.index - 1];
	if (!selectedFaq || selectedFaq.index === 0) {
		return { ok: false, message: "Faq not found" };
	}
	try {
		await prisma.$transaction([prisma.faq.update({ where: { id }, data: { index: selectedFaq.index - 1 } }), prisma.faq.update({ where: { id: previousFaq.id }, data: { index: selectedFaq.index } })]);
	} catch (e) {
		return { ok: false, message: "An error occurred while moving the faq" };
	}
	return { ok: true, message: "Faq moved successfully" };
}

export async function moveDown(id: string) {
	const selectedFaq = await prisma.faq.findUnique({ where: { id } });
	const currentFaqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	const nextFaq = currentFaqs[selectedFaq.index + 1];
	if (!selectedFaq) {
		return { ok: false, message: "Faq not found" };
	}
	if (selectedFaq.index === currentFaqs.length - 1) {
		return { ok: false, message: "Faq is already at the bottom" };
	}
	try {
		await prisma.$transaction([prisma.faq.update({ where: { id }, data: { index: selectedFaq.index + 1 } }), prisma.faq.update({ where: { id: nextFaq.id }, data: { index: selectedFaq.index } })]);
	} catch (e) {
		return { ok: false, message: "An error occurred while moving the faq" };
	}
	return { ok: true, message: "Faq moved successfully" };
}

export async function deleteFaq(id: string) {
	let currentFaqs;
	try {
		currentFaqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the faq" };
	}
	try {
		await prisma.$transaction([
			prisma.faq.delete({
				where: {
					id: id,
				},
			}),
			...currentFaqs.filter((faq) => faq.id !== id).map((faq, index) => prisma.faq.update({ where: { id: faq.id }, data: { index } })),
		]);
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the faq" };
	}
	return { ok: true, message: "Faq deleted successfully" };
}

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

export async function addFaq(formData: FormData) {
	let schema = z.object({
		title: z.string({ required_error: "Title is required" }).min(1).max(100, "Title can't be longer than 100 characters").trim(),
		content: z.string({ required_error: "Content is required" }).min(10, "Content can't be shorter than 10 characters").max(500, "Content can't be longer than 500 characters").trim(),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const currentFaqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	if (currentFaqs.length > 9) {
		return { ok: false, message: "You can't add more than 10 FAQs" };
	}
	await prisma.faq.create({ data: { ...parsedData, index: currentFaqs.length } });
	return { ok: true, message: "Faq added successfully" };
}
