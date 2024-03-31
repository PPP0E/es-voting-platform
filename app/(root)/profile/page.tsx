import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";
import { signOut } from "@/auth";

export default async function Page() {
	const session = await auth();
	const selectedCandidate = await prisma.candidate.findFirst({
		where: {
			id: session.user.candidate.id,
		},
		select: {
			id: true,
			student_id: true,
			slug: true,
			type: true,
			video_url: true,
			file: true,

			bereal: true,
			bio: true,
			facebook: true,
			instagram: true,
			officialName: true,
			officialSurname: true,
			slogan: true,
			snapchat: true,
			twitter: true,
			website: true,
			youtube: true,
			election: {
				select: {
					election_year: true,
					edit_bio: true,
					edit_slogan: true,
					edit_photo: true,
					edit_socials: true,
					edit_questions: true,
					Question: true,
				},
			},
			Answer: {
				include: {
					question: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});
	if (!selectedCandidate) return redirect("/");
	return <ProfileForm selectedCandidate={selectedCandidate} />;
}
