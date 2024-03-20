"use server";

import { auth } from "@/auth";
import { verifyPassword } from "@/lib/auth";
import { isVotingRunning } from "@/lib/isVotingRunning";
import prisma from "@/prisma/client";

export async function currentChange(electionId: string, e: any) {
	await prisma.$transaction([
		prisma.election.updateMany({
			where: {
				is_current: true,
			},
			data: {
				is_current: false,
			},
		}),
		prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				is_current: true,
				is_visible: true,
			},
		}),
	]);
}

export async function automaticChange(electionId: string, e: any) {
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			autoEnabled: e,
		},
	});
}

export async function forceChange(electionId: string, e: any) {
	const selectedElection = await prisma.election.findFirst({
		where: {
			id: electionId,
		},
	});
	if (!selectedElection.is_current && e == true) {
		console.log("forceChange", selectedElection.is_current, e);
		return { message: "You cannot enable voting for a non-current election" };
	}

	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			forceEnabled: e,
		},
	});
}

export async function visibility(electionId: string, e: any) {
	const selectedElection = await prisma.election.findFirst({
		where: {
			id: electionId,
		},
	});
	if (selectedElection.is_current) {
		return { message: "You cannot hide the current election" };
	}
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			is_visible: e,
		},
	});
}

export async function updateElectionDate(electionId: string, date: string) {
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			election_date: date,
		},
	});
	return { ok: true };
}

export async function updateStartTime(electionId: string, time: string) {
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			voting_start_time: time,
		},
	});
	return { ok: true };
}

export async function deleteAllVotes(electionId: string, password: string) {
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	const selectedUser = await prisma.admin.findFirst({
		where: {
			id: session.user.admin.id,
		},
	});
	if (!selectedUser) return { ok: false, message: "Unauthorized" };
	const validatePassword = await verifyPassword(password, selectedUser.password);
	if (!validatePassword) return { ok: false, message: "Invalid password" };
	const selectedElection = await prisma.election.findFirst({
		where: {
			id: electionId,
		},
	});
	const isElectionRunning = isVotingRunning(selectedElection);
	if (isElectionRunning) {
		return { ok: false, message: "You can't delete votes from an election which is currently running." };
	}
	await prisma.$transaction([
		prisma.vote.deleteMany({
			where: {
				Candidate: {
					election_id: electionId,
				},
			},
		}),
		prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				forceEnabled: false,
				autoEnabled: false,
				blocked: false,
			},
		}),
	]);
	return { ok: true };
}

export async function updateEndTime(electionId: string, time: string) {
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			voting_end_time: time,
		},
	});
	return { ok: true };
}
