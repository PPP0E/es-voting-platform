import { NextResponse } from "next/server";
import { minio } from "@/minio/client";
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";

export async function GET(request, { params }) {
	let userExists;
	try {
		userExists = await prisma.candidate.findUnique({
			where: {
				id: params.userId,
			},
			select: {
				photo: true,
			},
		});
	} catch (e) {
		notFound();
	}

	if (!userExists) notFound();
	if (!userExists.photo) notFound();
	let minioClient = minio();
	let url;
	try {
		url = await minioClient.presignedGetObject("eselections.org", "avatars/" + userExists.photo, 30 * 60);
	} catch (e) {
		notFound();
	}
	return NextResponse.redirect(url);
}
