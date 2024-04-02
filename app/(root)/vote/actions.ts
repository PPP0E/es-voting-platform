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
	let currentElection;
	try {
		currentElection = await prisma.election.findFirst({
			where: {
				is_current: true,
			},
			include: {
				Candidate: true,
			},
		});
	} catch (e) {
		return { ok: false, message: "No current election" };
	}
	if (!currentElection) return { ok: false, message: "No current election" };
	const isElectionRunning = isVotingRunning(currentElection);
	if (!isElectionRunning) redirect("/");

	let votes;
	try {
		votes = await prisma.vote.findMany({
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
	} catch (e) {
		return { ok: false, message: "An error occurred (VE02)" };
	}
	if (votes.length > 0) {
		return { ok: false, message: "You have already voted" };
	}
	const girlCandidateId = formData.get("GIRL");
	const boyCandidateId = formData.get("BOY");
	if (!girlCandidateId || !boyCandidateId) return { ok: false, message: "Invalid vote" };
	try {
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
	} catch (e) {
		return { ok: false, message: "An error occurred (VE03)" };
	}
	if (!currentElection.blocked) {
		try {
			await prisma.election.update({
				where: {
					id: currentElection.id,
				},
				data: {
					blocked: true,
				},
			});
		} catch (e) {}
	}
	return redirect("/vote");
}
