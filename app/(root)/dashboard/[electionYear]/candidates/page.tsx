import prisma from "@/prisma/client";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";
import { redirect } from "next/navigation";
import { AnswersButton, DeleteButton, EditButton, MoveDownButton, MoveUpButton } from "./Buttons";
import { ButtonGroup } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { isVotingRunning } from "@/lib/isVotingRunning";
import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";
import { QuestionsModal } from "./QuestionsModal";

export default async function Component({ params, searchParams }) {
	const { electionYear } = params;
	let selectedElection = await prisma.election.findFirst({
		where: {
			election_year: electionYear,
		},
		include: {
			Question: {
				orderBy: {
					index: "asc",
				},
			},
			Candidate: {
				orderBy: {
					officialName: "asc",
				},
				select: {
					officialName: true,
					officialSurname: true,
					student_id: true,
					video_url: true,
					speech_url: true,
					type: true,
					photo: true,
					slogan: true,
					instagram: true,
					facebook: true,
					twitter: true,
					bereal: true,
					bio: true,
					snapchat: true,
					website: true,
					youtube: true,
					slug: true,
					id: true,
				},
			},
		},
	});

	const questions = selectedElection.Question;

	const selectedEditCandidate = selectedElection.Candidate.find((candidate) => candidate.id === searchParams.edit);
	const selectedCandidateAnswers = selectedElection.Candidate.find((candidate) => candidate.id === searchParams.answers);

	let answers = [];
	if (selectedCandidateAnswers) {
		answers = await prisma.answer.findMany({
			where: {
				candidateId: selectedCandidateAnswers.id,
				candidate: {
					election: {
						election_year: electionYear,
					},
				},
			},
			include: {
				question: true,
			},
			orderBy: {
				question: {
					index: "asc",
				},
			},
		});
	}

	const votingRunning = isVotingRunning(selectedElection);

	return (
		<>
			<AddModal isBlocked={selectedElection.blocked} selectedElectionYear={selectedElection.election_year} />
			<EditModal candidate={selectedEditCandidate} />
			<QuestionsModal candidate={selectedCandidateAnswers} selectedElection={selectedElection} questions={questions} answers={answers} />
			<DeleteModal />
			<div>
				<ul className="w-full grid gap-4">
					{selectedElection.Candidate.map((candidate, index) => {
						const fullName = `${candidate.officialName} ${candidate.officialSurname}`;
						const typeName = candidate.type === "GIRL" ? "Head Girl Candidate" : "Head Boy Candidate";
						return (
							<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
								<div className="flex">
									<Avatar isBordered className="my-auto mr-4 ml-1" showFallback src={`/api/users/${candidate.id}/avatar`} />
									<div className="flex flex-col gap-1">
										<div className="flex gap-2">
											<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
										</div>
										<h1 className="text-default-400 mt-1">{typeName}</h1>
									</div>
								</div>
								<div className="flex gap-2 ml-auto my-auto">
									<Button as={Link} href={`/elections/${electionYear}/candidates/${candidate.slug || candidate.id}`} isIconOnly endContent={<Icon className="" icon="solar:user-outline" width={22} />} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto"></Button>
									<EditButton id={candidate.id} />
									<AnswersButton id={candidate.id} />
									{!selectedElection.blocked && !votingRunning && <DeleteButton id={candidate.id} />}
								</div>
							</li>
						);
					})}
				</ul>
				{!selectedElection.Candidate.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border max-w-max mx-auto px-10 border-divider">
						<p>No Candidates Found</p>
						<Link href={`/dashboard/${selectedElection.election_year}/candidates?add`} className="mx-auto" showAnchorIcon>
							Add a Candidate
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
