import type { TeamMember } from "./team-member-card";

import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Link as NextUILink } from "@nextui-org/link";

import TeamMemberCard from "./team-member-card";
import Icon from "@/components/ui/Icon";
import Confetti from "@/components/ui/confetti";
import { redirect } from "next/navigation";

export default function Component({ election, hideDescription = false, hideButtons = false }) {
	if (!election) redirect("/elections");
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
				{!!election.Candidate.length && (
					<div className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{election.Candidate.map((member, index) => (
							<TeamMemberCard electionYear={election.election_year} index={index} key={index} {...member} />
						))}
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
			{!!election.Candidate.length && election.is_current && (
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
