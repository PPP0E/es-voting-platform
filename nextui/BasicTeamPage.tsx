import type { TeamMember } from "./team-member-card";

import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Link as NextUILink } from "@nextui-org/link";

import TeamMemberCard from "./team-member-card";
import Icon from "@/components/ui/Icon";
import Confetti from "@/components/ui/confetti";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { Avatar, AvatarGroup } from "@nextui-org/avatar";

export default async function Component({ election, hideDescription = false, hideButtons = false }) {
	let girlWinners = [],
		boyWinners = [];
	if (election.publish_results) {
		hideButtons = true;
		girlWinners = prisma.candidate.findMany({
			where: {
				type: "GIRL",
				election: {
					id: election.id,
				},
			},
			orderBy: {
				Vote: {
					_count: "desc",
				},
			},
			take: 2,
		});
		boyWinners = prisma.candidate.findMany({
			where: {
				type: "BOY",
				election: {
					id: election.id,
				},
			},
			orderBy: {
				Vote: {
					_count: "desc",
				},
			},
			take: 2,
		});
		[girlWinners, boyWinners] = await Promise.all([girlWinners, boyWinners]);
	}

	function WinnerCard({ candidate, text }) {
		return (
			<div
				style={{
					backgroundImage: `url(/api/users/${candidate.id}/avatar)`,
				}}
				className={`bg-content1/60 bg-cover border rounded-3xl md:hover:rotate-2 md:hover:translate-x-2 duration-300 overflow-hidden aspect-square`}>
				<div className="flex w-auto h-full bg-gradient-to-b from-transparent to-black via-black/60">
					<div className="mt-auto p-6">
						<h3 className="mt-auto font-medium text-sm md:text-lg">
							{candidate?.officialName} {candidate?.officialSurname}
						</h3>
						<span className="md:text-small text-xs text-default-500 ">{text}</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{election.publish_results && <Confetti />}
			<section className="flex pwa:hidden max-w-5xl flex-col mx-auto min-h-screen items-center py-24 px-4">
				<div className="flex max-w-xl flex-col text-center">
					{!!election.Candidate.length && (
						<>
							<h2 className="font-medium text-white/70">{election.election_year} Student Elections</h2>
							{/* 							<h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">{!election.is_current ? "Meet the winners." : "Meet the candidates."}</h1>
							 */}
							<h1 className="text-4xl font-medium tracking-tight">{election.publish_results ? "Meet the winners." : "Meet the candidates."}</h1>
							<Spacer y={1} />
						</>
					)}
					{!!election.Candidate.length && (
						<>
							<h2 className="text-large text-default-500">{election.publish_results ? "United in vision and poised for action, our elected leaders are ready to make an impact." : "Our philosophy is to build a great team and then empower them to do great things."}</h2>
							<Spacer y={4} />
						</>
					)}
					{!hideButtons && !!election.Candidate.length && (
						<div className="flex w-full justify-center gap-2">
							<Button as={Link} href={`/elections/${election.election_year}`} variant="ghost">
								{election.election_year} Candidates
							</Button>
							<Button as={Link} href="/elections" color="secondary">
								Past Elections
							</Button>
						</div>
					)}
				</div>
				{!!election.Candidate.length && !election.publish_results && (
					<div className="mt-12 grid w-full grid-cols-1 gap-4 auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
						{election.Candidate.map((member, index) => (
							<TeamMemberCard electionYear={election.election_year} index={index} key={index} {...member} />
						))}
					</div>
				)}
				{!!election.Candidate.length && election.publish_results && (
					<div className="my-6 grid-cols-2 grid gap-4">
						<WinnerCard candidate={girlWinners[0]} text="Head Girl" />
						<WinnerCard candidate={boyWinners[0]} text="Head Boy" />
						<WinnerCard candidate={girlWinners[1]} text="Deputy Head Girl" />
						<WinnerCard candidate={boyWinners[1]} text="Deputy Head Boy" />
					</div>
				)}
				{!election.Candidate.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border border-divider">
						<p>No Candidates Registered in the {election.election_year} Elections</p>
						<NextUILink href="/elections" className="mx-auto" showAnchorIcon>
							See other elections
						</NextUILink>
					</div>
				)}
				{election.publish_results && (
					<Button as={Link} href={`/elections/${election.election_year}/candidates`} className="bg-content1/60 w-max p-2 px-6 border rounded-full mx-auto bottom-0 mt-auto">
						View All Candidates
					</Button>
				)}
			</section>
			{!!election.Candidate.length && election.is_current && !election.publish_results && (
				<div className="mb-20 pwa:hidden flex">
					<div className="text-tiny md:hover:bg-white md:hover:text-black duration-300 cursor-pointer bg-neutral-800 mx-auto p-1 pr-3 pl-1 rounded-full flex pt-auto text-center w-auto text-neutral-400">
						<Icon icon="material-symbols:info" width={24} />
						<p className="my-auto ml-2">Candidates are shuffled every minute</p>
					</div>
				</div>
			)}
			{!!election.Candidate.length && !election.is_current && (
				<div className="mb-20 pwa:hidden flex">
					<div className="text-tiny md:hover:bg-white md:hover:text-black duration-300 cursor-pointer bg-neutral-800 mx-auto p-1 pr-3 pl-1 rounded-full flex pt-auto text-center w-auto text-neutral-400">
						<Icon icon="material-symbols:info" width={24} />
						<p className="my-auto ml-2">Candidates are in alphabetical order</p>
					</div>
				</div>
			)}
		</>
	);
}
