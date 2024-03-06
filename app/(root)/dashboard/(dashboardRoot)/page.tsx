import { Icon } from "@/components/ui/Icon";
import prisma from "@/prisma/client";
import Link from "next/link";
import NewElectionButton from "./NewElectionButton";
import AddElectionModal from "./AddElectionModal";
import { Button } from "@nextui-org/button";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";
import { Avatar, AvatarGroup } from "@nextui-org/avatar";
import { Tooltip } from "@nextui-org/tooltip";
import { Divider } from "@nextui-org/divider";

export default async function Component({ searchParams }) {
	const eletionPerPage = 10;
	const page = searchParams.page || 1;
	const elections = await prisma.election.findMany({
		take: eletionPerPage,
		include: {
			_count: {
				select: {
					Candidate: true,
				},
			},
		},
		skip: (page - 1) * eletionPerPage,
		orderBy: {
			election_year: "desc",
		},
	});

	return (
		<>
			<AddElectionModal />
			<ul className="w-full grid gap-4">
				{elections.map((election) => {
					//endDay in form March 9
					const endDay = new Date(election.voting_end_date).toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
					});
					return (
						<li key={election.id} className="w-full bg-content1/60 p-4 flex rounded-xl border">
							<div className="flex flex-col gap-1">
								<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{election.election_year} Elections</p>
								<h1 className="text-default-400 mt-1">
									{election._count.Candidate} Candidates • {endDay}
								</h1>
							</div>
							<Button endContent={<Icon icon="solar:arrow-right-outline" width={20} />} as={Link} href={`/dashboard/${election.election_year || election.id}`} fullWidth className="border-small my-auto ml-auto border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
								Manage
							</Button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
