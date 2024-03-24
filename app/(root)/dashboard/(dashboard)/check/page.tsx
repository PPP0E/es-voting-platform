import prisma from "@/prisma/client";
import ClientComponent from "./ClientPage";

export default async function Component({ searchParams }) {
	let votes = [];
	if (searchParams.votes) {
		const voteIds = searchParams.votes.split("+");
		votes = await prisma.vote.findMany({
			where: {
				id: { in: voteIds },
			},
			include: {
				Candidate: {
					include: {
						election: true,
					},
				},
			},
		});
	}
	return <ClientComponent votes={votes} />;
}
