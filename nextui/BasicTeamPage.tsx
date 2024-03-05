import type { TeamMember } from "./team-member-card";

import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Link as NextUILink } from "@nextui-org/link";

import TeamMemberCard from "./team-member-card";
import Icon from "@/components/ui/Icon";

export default function Component({ election, hideDescription = false, hideButtons = false }) {
	return (
		<>
			<section className="flex max-w-5xl flex-col mx-auto items-center py-24 px-4">
				<div className="flex max-w-xl flex-col text-center">
					{!!election.Candidate.length && (
						<>
							<h2 className="font-medium text-white/70">2024 Student Elections</h2>
							{/* 							<h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">Meet the candidates. </h1>
							 */}{" "}
							<h1 className="text-4xl font-medium tracking-tight">Meet the candidates.</h1>
							<Spacer y={1} />
						</>
					)}
					{!hideDescription && !!election.Candidate.length && (
						<>
							<h2 className="text-large text-default-500">Our philosophy is to build a great team and then empower them to do great things.</h2>
							<Spacer y={4} />
						</>
					)}
					{!hideButtons && !!election.Candidate.length && (
						<div className="flex w-full justify-center gap-2">
							<Button as={Link} href={`/elections/${"2024"}`} variant="ghost">
								About 2024 Elections
							</Button>
							<Button as={Link} href="/elections" color="secondary">
								Explore Past Elections
							</Button>
						</div>
					)}
				</div>
				<div className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{election.Candidate.map((member, index) => (
						<TeamMemberCard electionYear={election.election_year} index={index} key={index} {...member} />
					))}
				</div>
				{!election.Candidate.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border border-divider">
						<p>No Candidates Registered in the {election.election_year} Elections</p>
						<NextUILink href="/elections" className="mx-auto" showAnchorIcon>
							See other elections
						</NextUILink>
					</div>
				)}
			</section>
			{election.Candidate.length && (
				<div className="mb-20 flex">
					<div className="text-tiny md:hover:bg-white md:hover:text-black duration-300 cursor-pointer bg-neutral-800 mx-auto p-1 pr-3 pl-1 rounded-full flex pt-auto text-center w-auto text-neutral-400">
						<Icon icon="material-symbols:info" width={24} />
						<p className="my-auto ml-2">Candidates are randomly shuffled</p>
					</div>
				</div>
			)}
		</>
	);
}
