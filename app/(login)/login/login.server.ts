"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import "server-only";

export async function studentLoginHandler(formData: any) {
	const enteredEmail = formData.get("username").trim().toLowerCase();
	const enteredPassword = formData.get("password").trim();
	try {
		await signIn("credentials", {
			redirect: false,
			username: enteredEmail,
			password: enteredPassword,
			userType: "student",
		});
	} catch (error) {
		return { ok: false, error: "An error occurred while trying to login." };
	}
	return { ok: true };
}
