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
import { redirect } from "next/navigation";
import PwaDetector from "./PwaDetector";
import PwaNavbar from "./PwaNavbar";

export const metadata = {
	title: "The English School Student Elections",
};

const montserrat = Montserrat({
	subsets: ["latin"],
	display: "swap",
});

export default async function RootLayout({ children }) {
	const faqs = await prisma.faq.count();
	return (
		<html lang="en" className={cn(montserrat.className, "dark")}>
			<head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-startup-image" href="/app-loader.png"></link>
			</head>
			<Providers>
				<body>
					<NextUIProvider>
						<Navbar faqsCount={faqs} />
						<PwaNavbar />
						<main className="flex min-h-screen shadow-md bg-black flex-col items-center justify-between">
							<div className="bg-dot-white/25 min-h-screen w-full rounded-b-[20px]">
								<Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
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
