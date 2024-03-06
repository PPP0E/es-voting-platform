import NewElectionButton from "./NewElectionButton";
import Navbar from "./Navbar";
import { Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import prisma from "@/prisma/client";
import { redirect } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

export default async function Component({ children, params }) {
	const selectedElection = await prisma.election.findFirst({
		where: {
			election_year: params.electionYear,
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

	if (!selectedElection) return redirect("/dashboard");

	return (
		<main className="mt-6 flex w-full flex-col items-center">
			<div className="w-full max-w-[1280px] px-4 lg:px-8">
				<header className="mb-6 flex w-full items-center justify-between">
					<div className="flex flex-row">
						<Button as={Link} href="/dashboard" isIconOnly size="sm" className="rounded-full mr-2 my-auto">
							<Icon icon="solar:alt-arrow-left-outline" width={24} className="text-white" />
						</Button>
						<div className="flex flex-col">
							<h1 className="text-xl font-bold text-default-900 lg:text-3xl">Election Settings</h1>
							<p className="text-small text-default-400 lg:text-small">Manage {selectedElection.election_year} Elections</p>
						</div>
					</div>
					<NewElectionButton />
				</header>
				<Navbar electionYear={selectedElection.election_year} />
				<Spacer y={4} />
				{children}
				<Spacer y={8} />
			</div>
		</main>
	);
}
