import prisma from "@/prisma/client";
import SettingsForm from "./SettingsForm";

export default async function Component({ params }) {
	const selectedElection = await prisma.election.findFirst({
		where: {
			election_year: params.electionYear,
		},
		include: {
			_count: {
				select: {
					Candidate: true,
				},
			},
		},
	});

	return <SettingsForm selectedElection={selectedElection} />;
}
