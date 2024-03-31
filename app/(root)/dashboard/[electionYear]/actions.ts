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
	try {
		await prisma.$transaction([
			prisma.election.updateMany({
				where: {
					is_current: true,
				},
				data: {
					is_current: false,
					forceEnabled: false,
					autoEnabled: false,
				},
			}),
			prisma.election.update({
				where: {
					id: electionId,
				},
				data: {
					is_current: true,
					is_visible: true,
					forceEnabled: false,
					autoEnabled: false,
				},
			}),
		]);
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Current election changed" };
}

export async function automaticChange(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedElection.is_current && e == true) {
		return { ok: false, message: "You cannot enable automatic voting for a non-current election" };
	}
	if (selectedElection.publish_results) {
		return { ok: false, message: "You cannot enable automatic voting for a published election" };
	}
	if (e && !selectedElection.voting_start_time) {
		return { ok: false, message: "You need to set the start time first" };
	}
	if (e && !selectedElection.voting_end_time) {
		return { ok: false, message: "You need to set the end time first" };
	}
	if (e && !selectedElection.election_date) {
		return { ok: false, message: "You need to set the election date first" };
	}
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				autoEnabled: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Automatic voting changed" };
}

export async function forceChange(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedElection.is_current && e == true) {
		return { message: "You cannot enable voting for a non-current election" };
	}
	if (selectedElection.publish_results) {
		return { ok: false, message: "You cannot enable voting for a published election" };
	}
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				forceEnabled: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	const message = `Force voting ${e ? "enabled" : "disabled"}`;
	return { ok: true, message };
}

export async function allowEditBio(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				edit_bio: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Bio editing enabled" };
}

export async function allowEditSlogan(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				edit_slogan: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Slogan editing enabled" };
}

export async function allowEditSocials(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				edit_socials: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Socials editing enabled" };
}

export async function allowEditPhoto(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				edit_photo: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Photo editing enabled" };
}

export async function allowEditQuestions(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				edit_questions: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Question editing enabled" };
}

export async function visibility(electionId: string, e: any) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user?.admin) return { ok: false, message: "Unauthorized" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (selectedElection.is_current) {
		return { ok: false, message: "You cannot hide the current election" };
	}
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				is_visible: e,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Election visibility changed" };
}

export async function updateElectionDate(electionId: string, date: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred" };
	}
	if (isVotingRunning(selectedElection)) {
		return { ok: false, message: "You can't change the date of an election which is currently running." };
	}
	if (selectedElection.autoEnabled) {
		return { ok: false, message: "You can't change the date of an election which has automatic voting enabled." };
	}
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				election_date: date,
			},
		});
	} catch (e) {
		console.log(e);
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Election date updated" };
}

export async function updateStartTime(electionId: string, time: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!time) return { ok: false, message: "Invalid time" };
	if (!time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) return { ok: false, message: "Invalid time" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				voting_start_time: time,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Start time updated" };
}

export async function deleteAllVotes(electionId: string, password: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
	let selectedUser;
	try {
		selectedUser = await prisma.admin.findFirst({
			where: {
				id: session.user.admin.id,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedUser) return { ok: false, message: "Unauthorized" };
	const validatePassword = await verifyPassword(password, selectedUser.password);
	if (!validatePassword) return { ok: false, message: "Invalid password" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	const isElectionRunning = isVotingRunning(selectedElection);
	if (isElectionRunning) {
		return { ok: false, message: "You can't delete votes from an election which is currently running." };
	}
	try {
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
					publish_results: false,
				},
			}),
		]);
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Votes deleted" };
}

export async function updateEndTime(electionId: string, time: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!time) return { ok: false, message: "Invalid time" };
	if (!time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) return { ok: false, message: "Invalid time" };
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				voting_end_time: time,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "End time updated" };
}

export async function deleteElection(electionId: string, password: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
	let selectedUser;
	try {
		selectedUser = await prisma.admin.findFirst({
			where: {
				id: session.user.admin.id,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedUser) return { ok: false, message: "Unauthorized" };
	const validatePassword = await verifyPassword(password, selectedUser.password);
	if (!validatePassword) return { ok: false, message: "Invalid password" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred" };
	}
	const isElectionRunning = isVotingRunning(selectedElection);
	if (isElectionRunning) {
		return { ok: false, message: "You can't delete an election which is currently running." };
	}
	if (selectedElection.blocked) {
		return { ok: false, message: "You can't delete an election which has votes." };
	}
	let candidates;
	try {
		candidates = await prisma.candidate.findMany({
			where: {
				election_id: electionId,
			},
		});
	} catch (e) {
		return { ok: false, message: "An error occurred" };
	}
	if (candidates.length > 0) {
		return { ok: false, message: "You can't delete an election which has candidates." };
	}
	try {
		await prisma.election.delete({
			where: {
				id: electionId,
			},
		});
	} catch (e) {
		if (e.code == "P2003") return { ok: false, message: "Please delete all application questions first" };
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Election deleted" };
}

export async function publishResults(electionId: string, password: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
	let selectedUser;
	try {
		selectedUser = await prisma.admin.findFirst({
			where: {
				id: session.user.admin.id,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedUser) return { ok: false, message: "Unauthorized" };
	const validatePassword = await verifyPassword(password, selectedUser.password);
	if (!validatePassword) return { ok: false, message: "Invalid password" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	const isElectionRunning = isVotingRunning(selectedElection);
	if (isElectionRunning) {
		return { ok: false, message: "You can't publish results of an election which is currently running." };
	}
	if (selectedElection.publish_results) {
		return { ok: false, message: "Results already published." };
	}
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				publish_results: true,
				blocked: true,
				forceEnabled: false,
				autoEnabled: false,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Results published on the public website." };
}

export async function unpublishResults(electionId: string, password: string) {
	const session = await auth();
	if (!session) return { ok: false, message: "Unauthorized" };
	if (!session.user.admin) return { ok: false, message: "Unauthorized" };
	if (!password || password.length < 8) {
		return { ok: false, message: "Invalid password" };
	}
	let selectedUser;
	try {
		selectedUser = await prisma.admin.findFirst({
			where: {
				id: session.user.admin.id,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedUser) return { ok: false, message: "Unauthorized" };
	const validatePassword = await verifyPassword(password, selectedUser.password);
	if (!validatePassword) return { ok: false, message: "Invalid password" };
	let selectedElection;
	try {
		selectedElection = await prisma.election.findFirst({
			where: {
				id: electionId,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	if (!selectedElection.publish_results) {
		return { ok: false, message: "Results are not published." };
	}
	try {
		await prisma.election.update({
			where: {
				id: electionId,
			},
			data: {
				publish_results: false,
				blocked: false,
			},
		});
	} catch {
		return { ok: false, message: "An error occurred" };
	}
	return { ok: true, message: "Results unpublished from the public website." };
}
