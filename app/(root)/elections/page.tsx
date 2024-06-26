import prisma from "@/prisma/client";
import { GlowingStarsBackgroundCard, GlowingStarsDescription, GlowingStarsTitle } from "@/components/ui/glowing-stars";
import { Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Icon } from "@iconify/react/dist/offline";
import groupIcon from "@iconify/icons-solar/users-group-two-rounded-linear";

export const revalidate = 60; // 1 minute

export const metadata = {
	metadataBase: new URL("https://eselections.org"),
	title: "Explore All Elections - The English School Student Elections",
	description: "Explore all past, current and future student elections of The English School.",
	openGraph: {
		images: "/assets/og-image.jpg",
	},
};

function formatDate(dateString) {
	const date = new Date(dateString);
	//day first
	const formatted = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});

	return formatted;
}

export default async function Component({ params }) {
	let elections;
	try {
		elections = await prisma.election.findMany({ where: { is_visible: true }, orderBy: { election_year: "desc" }, take: 9, include: { Candidate: true } });
	} catch (e) {
		return (
			<section className="flex max-w-5xl flex-col mx-auto items-center py-24 px-4">
				<div className="flex max-w-xl flex-col text-center">
					<h2 className="text-large text-default-500">No Elections Found</h2>
				</div>
			</section>
		);
	}
	if (!elections.length)
		return (
			<section className="flex max-w-5xl flex-col mx-auto items-center py-24 px-4">
				<div className="flex max-w-xl flex-col text-center">
					<h2 className="text-large text-default-500">No Elections Found</h2>
				</div>
			</section>
		);
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
					const printDate = date != "01/01/1970" ? date : "";
					return (
						<li key={election.id} className="bg-content1/60 border p-4 rounded-large flex flex-col gap-4">
							<h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">
								{election.election_year}
								<br />
								Elections
							</h2>
							<h2 className="text-large text-default-500">{printDate}</h2>
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
