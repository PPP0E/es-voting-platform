import React from "react";
import "@/styles/globals.css";
import Navbar from "./Navbar";
import NextUIProvider from "./NextUIProvider";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/sonner";
import CenteredFooterWithSocialLinks from "@/nextui/CenteredFooterWithSocialLinks";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/cn";
import { Spotlight } from "@/components/ui/Spotlight";
import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import PwaDetector from "./PwaDetector";
import PwaNavbar from "./PwaNavbar";
import TopFl, { BottomFl } from "./flprovider";

export const metadata = {
	metadataBase: new URL("https://eselections.org"),
	title: "The English School Student Elections",
	description: "The official website for The English School student elections.",
	openGraph: {
		images: "/assets/og-image.jpg",
	},
};

export const runtime = "nodejs";

const montserrat = Montserrat({
	subsets: ["latin"],
	display: "swap",
});

export default async function RootLayout({ children }) {
	let faqs, currentElection;
	try {
		[faqs, currentElection] = await Promise.all([
			prisma.faq.count(),
			prisma.election.findFirst({
				where: {
					is_current: true,
				},
			}),
		]);
	} catch (e) {
		notFound();
	}

	return (
		<html lang="en" className={cn(montserrat.className, "")}>
			<head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-startup-image" href="/app-loader.png"></link>
			</head>
			<Providers>
				<body className="max-w-screen">
					<NextUIProvider>
						<Navbar faqsCount={faqs} currentElection={currentElection} />
						<PwaNavbar />
						<main className="flex min-h-screen max-w-screen overflow-x-hidden w-screen dark:bg-black bg-white flex-col items-center justify-between">
							<TopFl />
							<BottomFl />
							<div className="dark:bg-dot-white/25 bg-dot-black/25 z-[2] min-h-screen w-full rounded-b-[20px]">
								<Spotlight className="-top-40 left-0 md:left-60 md:-top-20 light:hidden" fill="white" />
								<PwaDetector />
								{children}
							</div>
						</main>
						<Toaster />
						<CenteredFooterWithSocialLinks />
					</NextUIProvider>
				</body>
			</Providers>
		</html>
	);
}
