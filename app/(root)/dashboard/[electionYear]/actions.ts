"use server";

import { auth } from "@/auth";
import { verifyPassword } from "@/lib/auth";
import { isVotingRunning } from "@/lib/isVotingRunning";
import prisma from "@/prisma/client";

/* model Election {
   id                 String      @id @unique @default(uuid())
   election_date      String?
   election_year      String      @unique
   is_current         Boolean     @default(false)
   forceEnabled       Boolean     @default(false)
   autoEnabled        Boolean     @default(false)
   blocked            Boolean     @default(false)
   total_voters       Int?
   description        String?
   voting_start_time  String?
   voting_end_time    String?
   publish_results    Boolean     @default(false)
   is_visible         Boolean     @default(false)
   //
   edit_bio           Boolean     @default(true)
   edit_slogan        Boolean     @default(true)
   edit_socials       Boolean     @default(true) //includes social media and video; speech is added by admin
   edit_photo         Boolean     @default(true)
   edit_questions     Boolean     @default(true)
   //
   candidates_visible Boolean     @default(false)
   //
   Candidate          Candidate[]
   Question           Question[]
} */

export async function currentChange(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
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
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
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
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	const selectedElection = await prisma.election.findFirst({
		where: {
			id: electionId,
		},
	});
	if (!selectedElection.is_current && e == true) {
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

export async function allowEditBio(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			edit_bio: e,
		},
	});
	return { ok: true };
}

export async function allowEditSlogan(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			edit_slogan: e,
		},
	});
	return { ok: true, message: "Slogan editing enabled" };
}

export async function allowEditSocials(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			edit_socials: e,
		},
	});
	return { ok: true, message: "Socials editing enabled" };
}

export async function allowEditPhoto(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			edit_photo: e,
		},
	});
	return { ok: true, message: "Photo editing enabled" };
}

export async function allowEditQuestions(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	await prisma.election.update({
		where: {
			id: electionId,
		},
		data: {
			edit_questions: e,
		},
	});
	return { ok: true, message: "Question editing enabled" };
}

export async function visibility(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
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
	return { ok: true, message: "Election visibility changed" };
}

export async function updateElectionDate(electionId: string, date: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
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
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
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
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
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
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
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

export async function deleteElection(electionId: string, password: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
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
		return { ok: false, message: "You can't delete an election which is currently running." };
	}
	//check if all the candidates are deleted if not dont allow to delete election
	const candidates = await prisma.candidate.findMany({
		where: {
			election_id: electionId,
		},
	});
	if (candidates.length > 0) {
		return { ok: false, message: "You can't delete an election which has candidates." };
	}
	await prisma.election.delete({
		where: {
			id: electionId,
		},
	});
	return { ok: true, message: "Election deleted" };
}
