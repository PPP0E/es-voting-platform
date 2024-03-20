import BasicTeamPage from "@/nextui/BasicTeamPage";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

export default async function Component({ params }) {
	const { electionYear } = params;
	let selectedElection = await prisma.election.findFirst({
		where: {
			election_year: electionYear,
			is_visible: true,
		},
		select: {
			id: true,
			Candidate: {
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
			is_current: true,
			election_year: true,
			is_visible: true,
			publish_results: true,
		},
	});
	if (!selectedElection) redirect("/elections");

	if (selectedElection.is_current) {
		const shuffledCandidates = selectedElection.Candidate.sort(() => Math.random() - 0.5);
		selectedElection.Candidate = shuffledCandidates;
	}
	selectedElection.publish_results = false;
	return (
		<>
			<Button isIconOnly as={Link} href={`/elections/${electionYear}`} className="absolute bg-content1/60 border m-5 rounded-full">
				<Icon icon="solar:alt-arrow-left-outline" width={24} className="text-white" />
			</Button>
			<BasicTeamPage hideButtons hideDescription election={selectedElection} />
		</>
	);
}
