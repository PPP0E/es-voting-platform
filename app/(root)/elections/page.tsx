import prisma from "@/prisma/client";
import { GlowingStarsBackgroundCard, GlowingStarsDescription, GlowingStarsTitle } from "@/components/ui/glowing-stars";
import { Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Icon } from "@iconify/react/dist/offline";
import groupIcon from "@iconify/icons-solar/users-group-two-rounded-linear";

export const revalidate = 60 * 5; // 5 minutes

function formatDate(dateString) {
	const date = new Date(dateString);
	const formatted = date.toLocaleDateString();
	if (formatted == "Invalid Date") return "01/01/1970";
	if (formatted == "1/1/1970") return "01/01/1970";
	return formatted;
}

export default async function Component({ params }) {
	const elections = await prisma.election.findMany({ where: { is_visible: true }, orderBy: { election_year: "desc" }, take: 9, include: { Candidate: true } });
	return (
		<section className="flex max-w-5xl flex-col mx-auto items-center py-24 px-4">
			<div className="flex max-w-xl flex-col text-center">
				<h1 className="text-4xl font-medium tracking-tight">Explore All Elections</h1>
				<Spacer y={4} />
				<h2 className="text-large text-default-500">All Past, Current and Future Student Elections</h2>
			</div>
			<ul className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{elections.map((election) => {
					const date = formatDate(election.election_date);
					const printDate = date != "01/01/1970" ? ` • ${date}` : "";
					const candidateS = election.Candidate.length > 1 || !election.Candidate.length ? "s" : "";
					const candidateCount = election.Candidate.length;
					return (
						<li key={election.id} className="bg-content1/60 p-4 rounded-large flex flex-col gap-4">
							{/* 						<h2 className="text-large text-default-600 my-auto text-center md:text-left">{election.election_year} Student Elections</h2>
							 */}
							<h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">
								{election.election_year}
								<br />
								Elections
							</h2>
							<h2 className="text-large text-default-500">
								{candidateCount} Candidate{candidateS}
								{printDate}
							</h2>
							<Button as={Link} href={`/elections/${election.election_year || election.id}`} fullWidth className="border-small ml-auto border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-full">
								View Details
							</Button>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
