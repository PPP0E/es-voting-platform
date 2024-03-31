import { Spacer } from "@nextui-org/react";
import prisma from "@/prisma/client";
import { isVotingRunning } from "@/lib/isVotingRunning";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import VoteSelector from "./VoteSelector";

export const dynamic = "force-dynamic";

export default async function Component({ params }) {
	const session = await auth();
	const currentElection = await prisma.election.findFirst({
		where: {
			is_current: true,
		},
		include: {
			Candidate: true,
		},
	});
	if (!currentElection || !session || !session?.user?.student) redirect("/");

	const votes = await prisma.vote.findMany({
		where: {
			student_id: session.user.student.id,
			Candidate: {
				election: {
					id: currentElection.id,
				},
			},
		},
		select: {
			id: true,
		},
	});
	let initialPage = 1;
	if (votes.length > 0) {
		initialPage = 2;
	}

	const isElectionRunning = isVotingRunning(currentElection);
	if (!session || !isElectionRunning || !session.user.student || !session) redirect("/");
	return (
		<section className="flex pwa:hidden max-w-5xl flex-col mx-auto items-center py-24 px-4">
			<VoteSelector votes={votes} initialPage={initialPage} currentElection={currentElection} />
		</section>
	);
}
