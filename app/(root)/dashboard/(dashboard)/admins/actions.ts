"use server";

import { auth } from "@/auth";
import { hashPassword } from "@/lib/auth";
import prisma from "@/prisma/client";
import { z } from "zod";

export async function deleteAdmin(id: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let adminCount;
	const sessionId = session.user.admin.id;
	if (sessionId === id) {
		return { ok: false, message: "You can't delete yourself" };
	}
	try {
		adminCount = await prisma.admin.count();
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the admin" };
	}
	if (adminCount === 1) {
		return { ok: false, message: "You can't delete the only admin" };
	}
	try {
		await prisma.admin.delete({ where: { id } });
	} catch (e) {
		return { ok: false, message: "An error occurred while deleting the admin" };
	}
	return { ok: true, message: "Admin deleted successfully" };
}

export async function editAdmin(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		fullName: z.string({ required_error: "Full Name is required" }).trim().max(50, "Title name be longer than 50 characters"),
		email: z.string({ required_error: "Email is required" }).trim().max(50, "Email can't be shorter than 50 characters"),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const { id, ...data } = parsedData;
	await prisma.admin.update({ where: { id }, data });
	return { ok: true, message: "Admin edited successfully" };
}

export async function editPassword(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		id: z.string().uuid(),
		password: z.string({ required_error: "Password is required" }).trim().min(8, "Password can't be shorter than 8 characters").max(50, "Password can't be longer than 50 characters"),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const { id, ...data } = parsedData;
	await prisma.admin.update({ where: { id }, data: { password: await hashPassword(data.password) } });
	return { ok: true, message: "Admin edited successfully" };
}

export async function addAdmin(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let schema = z.object({
		fullName: z.string({ required_error: "Full name is required" }).trim().max(50, "Name can't be longer than 50 characters"),
		email: z.string({ required_error: "Email is required" }).trim().min(1).max(50, "Email can't be longer than 50 characters").toLowerCase(),
		password: z.string({ required_error: "Password is required" }).trim().min(8, "Password can't be shorter than 8 characters").max(50, "Password can't be longer than 50 characters"),
	});
	let parsedData;
	try {
		parsedData = schema.parse(Object.fromEntries(formData));
	} catch ({ errors }) {
		return { ok: false, message: errors[0].message };
	}
	const currentAdmins = await prisma.admin.findMany({ orderBy: { fullName: "asc" } });
	if (currentAdmins.length > 24) {
		return { ok: false, message: "You can't add more than 25 Admins" };
	}
	await prisma.admin.create({ data: { fullName: parsedData.fullName, email: parsedData.email, password: await hashPassword(parsedData.password) } });
	return { ok: true, message: "Admin added successfully" };
}
