"use server";

import { auth } from "@/auth";
import { isVotingRunning } from "@/lib/isVotingRunning";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";

export async function vote(formData: FormData) {
	const session = await auth();
	if (!session) return { ok: false, message: "You are not logged in" };
	if (!session.user.student) return { ok: false, message: "You are not a student" };
	const studentId = session.user.student.id;
	if (!studentId) return { ok: false, message: "You are not a student" };
	const currentElection = await prisma.election.findFirst({
		where: {
			is_current: true,
		},
		include: {
			Candidate: true,
		},
	});
	const isElectionRunning = isVotingRunning(currentElection);
	if (!isElectionRunning) redirect("/");
	const votes = await prisma.vote.findMany({
		where: {
			student_id: studentId,
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
	if (votes.length > 0) {
		return { ok: false, message: "You have already voted" };
	}
	const girlCandidateId = formData.get("GIRL");
	const boyCandidateId = formData.get("BOY");
	if (!girlCandidateId || !boyCandidateId) return { ok: false, message: "Invalid vote" };
	await prisma.$transaction([
		prisma.vote.create({
			data: {
				student_id: studentId,
				Candidate: {
					connect: {
						id: girlCandidateId as string,
					},
				},
			},
		}),
		prisma.vote.create({
			data: {
				student_id: studentId,
				Candidate: {
					connect: {
						id: boyCandidateId as string,
					},
				},
			},
		}),
	]);
	if (!currentElection.blocked) {
		await prisma.election.update({
			where: {
				id: currentElection.id,
			},
			data: {
				blocked: true,
			},
		});
	}
	return redirect("/vote");
}
