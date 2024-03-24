import Icon from "@/components/ui/Icon";
import prisma from "@/prisma/client";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { IncreasingStat } from "./IncreasingStat";

export default async function Page({ params }) {
	const candidates = await prisma.candidate.findMany({
		where: {
			election: {
				election_year: params.electionYear,
			},
		},
		select: {
			id: true,
			officialName: true,
			officialSurname: true,
			views: true,
			type: true,
			slug: true,
		},
		orderBy: {
			views: "desc",
		},
	});

	const girlCandidates = candidates.filter((candidate) => candidate.type === "GIRL");
	const boyCandidates = candidates.filter((candidate) => candidate.type === "BOY");

	return (
		<div className="gap-4 lg:grid-cols-3  grid">
			<div>
				<p className="text-default-400 mb-1 ml-2">All Candidate Profile Views</p>
				<ul className="gap-4 flex flex-col">
					{candidates.map((candidate) => {
						const fullName = candidate.officialName + " " + candidate.officialSurname;
						const typeName = candidate.type === "GIRL" ? "Head Girl Candidate" : "Head Boy Candidate";
						return (
							<li key={candidate.id} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
								<div className="flex">
									<Avatar isBordered className="my-auto mr-4 ml-1" showFallback src={`/api/users/${candidate.id}/avatar`} />
									<div className="flex flex-col gap-1">
										<div className="flex gap-2">
											<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
										</div>
										<h1 className="text-default-400 mt-1">{typeName}</h1>
									</div>
								</div>
								<div className="flex flex-row gap-2 ml-auto my-auto">
									<IncreasingStat value={candidate.views} />
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<p className="text-default-400 mb-1 ml-2">Head Girl Candidate Profile Views</p>
				<ul className="gap-4 flex flex-col">
					{girlCandidates.map((candidate) => {
						const fullName = candidate.officialName + " " + candidate.officialSurname;
						const typeName = candidate.type === "GIRL" ? "Head Girl Candidate" : "Head Boy Candidate";
						return (
							<li key={candidate.id} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
								<div className="flex">
									<Avatar isBordered className="my-auto mr-4 ml-1" showFallback src={`/api/users/${candidate.id}/avatar`} />
									<div className="flex flex-col gap-1">
										<div className="flex gap-2">
											<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
										</div>
										<h1 className="text-default-400 mt-1">{typeName}</h1>
									</div>
								</div>
								<div className="flex flex-row gap-2 ml-auto my-auto">
									<IncreasingStat value={candidate.views} />
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<p className="text-default-400 mb-1 ml-2">Head Boy Candidate Profile Views</p>
				<ul className="gap-4 flex flex-col">
					{boyCandidates.map((candidate) => {
						const fullName = candidate.officialName + " " + candidate.officialSurname;
						const typeName = candidate.type === "GIRL" ? "Head Girl Candidate" : "Head Boy Candidate";
						return (
							<li key={candidate.id} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
								<div className="flex">
									<Avatar isBordered className="my-auto mr-4 ml-1" showFallback src={`/api/users/${candidate.id}/avatar`} />
									<div className="flex flex-col gap-1">
										<div className="flex gap-2">
											<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{fullName}</p>
										</div>
										<h1 className="text-default-400 mt-1">{typeName}</h1>
									</div>
								</div>
								<div className="flex flex-row gap-2 ml-auto my-auto">
									<IncreasingStat value={candidate.views} />
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
