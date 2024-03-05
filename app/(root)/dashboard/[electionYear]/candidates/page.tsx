import prisma from "@/prisma/client";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";
import { redirect } from "next/navigation";
import { DeleteButton, EditButton, MoveDownButton, MoveUpButton } from "./Buttons";
import { ButtonGroup } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { isVotingRunning } from "@/lib/isVotingRunning";

export default async function Component({ params }) {
	const { electionYear } = params;
	let selectedElection = await prisma.election.findFirst({
		where: {
			election_year: electionYear,
		},
		include: {
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
		},
	});

	const votingRunning = isVotingRunning(selectedElection);
	console.log(votingRunning);

	//refresh every 5 minutes if voting is running

	return (
		<>
			<div>
				<ul className="w-full grid gap-4">
					{selectedElection.Candidate.map((candidate, index) => {
						const fullName = `${candidate.officialName} ${candidate.officialSurname}`;
						const typeName = candidate.type === "GIRL" ? "Head Girl Candidate" : "Head Boy Candidate";
						return (
							<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
								<div className="flex">
									<Avatar isBordered className="my-auto mr-4 ml-1" src="" />
									<div className="flex flex-col gap-1">
										<div className="flex gap-2">
											<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
										</div>
										<h1 className="text-default-400 mt-1">{typeName}</h1>
									</div>
								</div>
								<div className="flex gap-2 ml-auto my-auto">
									<EditButton id={candidate.id} />
									<DeleteButton id={candidate.id} />
								</div>
							</li>
						);
					})}
				</ul>
				{!selectedElection.Candidate.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border max-w-max mx-auto px-10 border-divider">
						<p>No FAQs found</p>
						<Link href="/dashboard/faqs?add" className="mx-auto" showAnchorIcon>
							Add a FAQ
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
