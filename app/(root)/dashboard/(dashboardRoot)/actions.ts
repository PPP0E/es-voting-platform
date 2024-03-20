"use server";
import prisma from "@/prisma/client";
import { z } from "zod";

export async function addElection(formData: FormData) {
	console.log("formData", formData);
	const schema = z.object({
		election_year: z
			.string()
			.min(2, "Invalid election year format")
			.max(2, "Invalid election year format")
			.regex(/^\d{2}$/, "Invalid election year format")
			.transform((val) => `20${val}`),
	});

	const result = schema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return {
			ok: false,
			message: "Invalid election year",
		};
	}
	await prisma.election.create({
		data: {
			election_year: result.data.election_year,
		},
	});
}