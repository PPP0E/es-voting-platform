"use server";

import { auth } from "@/auth";
import { isVotingRunning } from "@/lib/isVotingRunning";
import prisma from "@/prisma/client";

export async function deleteBallot(ballotId) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	const selectedBallot = await prisma.vote.findFirst({
		where: {
			id: ballotId,
		},
		include: {
			Candidate: {
				include: {
					election: true,
				},
			},
		},
	});
	const isElectionRunning = isVotingRunning(selectedBallot.Candidate.election);
	if (!isElectionRunning) return { ok: false, message: "You can't delete a vote from an election which isn't currently running." };
	if (selectedBallot.Candidate.election.publish_results) return { ok: false, message: "You can't delete a vote from an election which has published results." };
	await prisma.vote.deleteMany({
		where: {
			student_id: selectedBallot.student_id,
			Candidate: {
				election: {
					id: selectedBallot.Candidate.election.id,
				},
			},
		},
	});
	return { ok: true, message: "All ballots of voter in the given election deleted." };
}
