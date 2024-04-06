import NewElectionButton from "./NewElectionButton";
import Navbar from "./Navbar";
import { Spacer } from "@nextui-org/react";
import prisma from "@/prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
	metadataBase: new URL("https://eselections.org"),
	title: "Manage Elections - The English School",
	description: "Manage the student elections of The English School.",
	openGraph: {
		images: "/assets/og-image.jpg",
	},
};

export default async function Component({ children }) {
	return (
		<main className="mt-6 flex w-full flex-col items-center">
			<div className="w-full max-w-[1280px] px-4 lg:px-8">
				<header className="mb-6 flex w-full items-center justify-between">
					<div className="flex flex-col">
						<h1 className="text-xl font-bold text-default-900 lg:text-3xl">Manage Elections</h1>
					</div>
					<NewElectionButton />
				</header>
				<Navbar />
				<Spacer y={4} />
				{children}
				<Spacer y={8} />
			</div>
		</main>
	);
}
