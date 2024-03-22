import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await auth();
	if (!session || !session.candidate) redirect("/login");

	return (
		<div>
			<p>ADMIN {JSON.stringify(session.user.admin, null, 2)}</p>
			<p>STUDENT {JSON.stringify(session.user.student, null, 2)}</p>
		</div>
	);
}
