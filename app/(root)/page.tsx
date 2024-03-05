import BasicTeamPage from "@/nextui/BasicTeamPage";
import prisma from "@/prisma/client";
import { Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import TeamMemberCard from "@/nextui/team-member-card";

export default async function Home() {
	let currentElection = await prisma.election.findFirst({
		where: {
			is_current: true,
			is_visible: true,
		},
		select: {
			id: true,
			Candidate: {
				orderBy: {
					officialName: "asc",
				},
				select: {
					officialName: true,
					officialSurname: true,
					type: true,
					photo: true,
					slogan: true,
					instagram: true,
					facebook: true,
					twitter: true,
					bereal: true,
					snapchat: true,
					website: true,
					youtube: true,
					slug: true,
					id: true,
				},
			},
			election_year: true,
			is_visible: true,
			publish_results: true,
		},
	});

	const shuffledCandidates = currentElection.Candidate.sort(() => Math.random() - 0.5);
	currentElection.Candidate = shuffledCandidates;

	return <BasicTeamPage election={currentElection} />;
}
