import prisma from "@/prisma/client";
import { Avatar } from "@nextui-org/avatar";
import { Progress } from "@nextui-org/progress";
import Revalidator from "../results/Revalidator";
import { Spacer } from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";
import { isVotingRunning } from "@/lib/isVotingRunning";
import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";

export default async function Component({ params }) {
	const selectedYear = params.electionYear;
	if (!selectedYear) return null;
	const selectedElection = await prisma.election.findFirst({
		where: {
			election_year: selectedYear,
		},
	});
	let boyCandidates = await prisma.candidate.findMany({
		where: {
			election: {
				election_year: selectedYear,
			},
			type: "BOY",
		},
		orderBy: {
			Vote: {
				_count: "desc",
			},
		},
		include: {
			_count: {
				select: {
					Vote: true,
				},
			},
		},
	});
	let girlCandidates = await prisma.candidate.findMany({
		where: {
			election: {
				election_year: selectedYear,
			},
			type: "GIRL",
		},
		orderBy: {
			Vote: {
				_count: "desc",
			},
		},
		include: {
			_count: {
				select: {
					Vote: true,
				},
			},
		},
	});

	const totalBoyCandidateVotes = boyCandidates.reduce((acc, candidate) => acc + candidate._count.Vote, 0);
	const totalGirlCandidateVotes = girlCandidates.reduce((acc, candidate) => acc + candidate._count.Vote, 0);
	const isElectionRunning = isVotingRunning(selectedElection);
	const totalBallots = selectedElection.total_voters * 2;
	const usedBallots = totalBoyCandidateVotes + totalGirlCandidateVotes;
	const percentageComplete = ((usedBallots / totalBallots) * 100).toString().slice(0, 5);

	const percentageCompleteText = parseInt(percentageComplete) <= 100 ? `${percentageComplete}% Complete` : "Complete";
	const usedBallotsText = usedBallots <= totalBallots ? `${usedBallots} out of ${totalBallots} Ballots` : `${usedBallots} Ballots Used`;
	const isValid = usedBallots <= totalBallots;
	const areResultsPublished = selectedElection.publish_results;
	const isElectionUpcoming = (selectedElection.voting_start_date > new Date() && !isElectionRunning && selectedElection.autoEnabled) || true;
	return (
		<div>
			{isElectionRunning && (
				<>
					<Revalidator revalidate={10000} />
					<div className="w-full flex-col gap-2  bg-content1/60 p-4 flex md:flex-col rounded-xl border">
						<div className="flex">
							<div className="flex flex-col gap-1">
								<div className="flex gap-2">
									<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] animate-pulse dark:to-foreground-200">Live Election</p>
								</div>
								<p className="text-default-400 mt-1"></p>
							</div>
							<div className="flex text-right ml-auto flex-col gap-1">
								<div className="flex gap-2">
									<p className="bg-gradient-to-br ml-auto from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{percentageCompleteText}</p>
								</div>
								<p className="text-default-400 mt-1">{usedBallotsText}</p>
							</div>
						</div>
						{isValid && <Progress aria-label="Loading..." isIndeterminate={!selectedElection.total_voters} maxValue={totalBallots} value={totalBoyCandidateVotes + totalGirlCandidateVotes} isStriped size="sm" className="mt-1" />}
					</div>
					<Spacer y={4} />
				</>
			)}
			{areResultsPublished && (
				<>
					<div className="w-full flex-col gap-2  bg-content1/60 p-4 flex md:flex-col rounded-xl border">
						<div className="flex">
							<div className="flex flex-col gap-1">
								<div className="flex gap-2 flex-row align-middle">
									<Icon icon="fluent-mdl2:completed-solid" height={20} className="my-auto mr-1 mb-[-5px]" />
									<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">Results Published</p>
								</div>
								<p className="text-default-400 mt-1"></p>
							</div>
							<div className="flex text-right ml-auto flex-col gap-1">
								<div className="flex gap-2">
									<p className="bg-gradient-to-br ml-auto from-foreground-800 to-foreground-500 bg-clip-text text-xl font-regular tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{Math.round(usedBallots / 2)} Students Voted</p>
								</div>
							</div>
						</div>
					</div>
					<Spacer y={4} />
				</>
			)}
			{isElectionUpcoming && !isElectionRunning && (
				<>
					<div className="w-full flex-col gap-2  bg-content1/60 p-4 flex md:flex-col rounded-xl border">
						<div className="flex">
							<div className="flex flex-col gap-1">
								<div className="flex gap-2 flex-row align-middle">
									<Icon icon="solar:calendar-outline" height={22} className="my-auto mr-1 mb-[-5px]" />
									<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">Upcoming</p>
								</div>
								<p className="text-default-400 mt-1"></p>
							</div>
							<div className="flex text-right ml-auto flex-col gap-1">
								<div className="flex gap-2">
									<p className="bg-gradient-to-br ml-auto from-foreground-800 to-foreground-500 bg-clip-text text-xl font-regular tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">
										{new Date(selectedElection.voting_start_date).toLocaleString("en-US", {
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}
									</p>
								</div>
							</div>
						</div>
					</div>
					<Spacer y={4} />
				</>
			)}
			<p className="text-default-400 text-large my-1 ml-2">Head Girl Candidates</p>
			<ul className="w-full grid gap-4">
				{girlCandidates.map((candidate, index) => {
					const fullName = `${candidate.officialName} ${candidate.officialSurname}`;
					const isHeadGirl = index == 0 && totalGirlCandidateVotes > 1;
					const isDeputyHeadGirl = index == 1 && totalGirlCandidateVotes > 1;
					const neitherHeadNorDeputy = !isHeadGirl && !isDeputyHeadGirl;
					let percentage = ((candidate._count.Vote / totalGirlCandidateVotes) * 100).toString().slice(0, 5);
					if (percentage === "NaN") percentage = "0";
					return (
						<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-col rounded-xl border">
							<div className="flex">
								<Avatar isBordered className="my-auto mr-4 ml-1" src="" />
								<div className="flex flex-col gap-1">
									<div className="flex gap-2">
										<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
									</div>
									<p className="text-default-400 mt-1">
										{isHeadGirl && "Head Girl"}
										{isDeputyHeadGirl && "Deputy Head Girl"}
										{neitherHeadNorDeputy && "Candidate"}
									</p>
								</div>
								<div className="flex text-right ml-auto flex-col gap-1">
									<div className="flex gap-2">
										<p className="bg-gradient-to-br ml-auto from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{percentage}%</p>
									</div>
									<p className="text-default-400 mt-1">{candidate._count.Vote} Votes</p>
								</div>
							</div>
							<Progress aria-label="Loading..." isStriped size="sm" value={candidate._count.Vote} maxValue={totalGirlCandidateVotes} className="mt-1" />
						</li>
					);
				})}
			</ul>
			<Spacer y={4} />
			<p className="text-default-400 text-large my-1 ml-2">Head Boy Candidates</p>
			<ul className="w-full grid gap-4">
				{boyCandidates.map((candidate, index) => {
					const fullName = `${candidate.officialName} ${candidate.officialSurname}`;
					const isHeadBoy = index == 0 && totalBoyCandidateVotes > 1;
					const isDeputyHeadGirl = index == 1 && totalBoyCandidateVotes > 1;
					const neitherHeadNorDeputy = !isHeadBoy && !isDeputyHeadGirl;
					let percentage = ((candidate._count.Vote / totalBoyCandidateVotes) * 100).toString().slice(0, 5);
					if (percentage === "NaN") percentage = "0";
					return (
						<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-col rounded-xl border">
							<div className="flex">
								<Avatar isBordered className="my-auto mr-4 ml-1" src="" />
								<div className="flex flex-col gap-1">
									<div className="flex gap-2">
										<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
									</div>
									<p className="text-default-400 mt-1">
										{isHeadBoy && "Head Boy"}
										{isDeputyHeadGirl && "Deputy Head Boy"}
										{neitherHeadNorDeputy && "Candidate"}
									</p>
								</div>
								<div className="flex text-right ml-auto flex-col gap-1">
									<div className="flex gap-2">
										<p className="bg-gradient-to-br ml-auto from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{percentage}%</p>
									</div>
									<p className="text-default-400 mt-1">{candidate._count.Vote} Votes</p>
								</div>
							</div>
							<Progress aria-label="Loading..." isStriped size="sm" value={candidate._count.Vote} maxValue={totalBoyCandidateVotes} className="mt-1" />
						</li>
					);
				})}
			</ul>
		</div>
	);
}

{
	/* <div className="flex gap-4 py-4">
<Badge
  disableOutline
  classNames={{
    badge: "w-5 h-5",
  }}
  color="primary"
  content={
    <Button
      isIconOnly
      className="p-0 text-primary-foreground"
      radius="full"
      size="sm"
      variant="light"
    >
      <Icon icon="solar:pen-2-linear" />
    </Button>
  }
  placement="bottom-right"
  shape="circle"
>
  <Avatar className="h-14 w-14" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
</Badge>
<div className="flex flex-col items-start justify-center">
  <p className="font-medium">Tony Reichert</p>
  <span className="text-small text-default-500">Professional Designer</span>
</div>
</div> */
}
