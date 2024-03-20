import React from "react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import NextUIProvider from "./NextUIProvider";
import { Toaster } from "@/components/ui/sonner";
import CenteredFooterWithSocialLinks from "@/nextui/CenteredFooterWithSocialLinks";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata = {
	title: "The English School Student Elections",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="bg-white">
			<head>
				<link rel="apple-touch-startup-image" href="/app-loader.png"></link>
			</head>
			<body className={inter.className}>
				<NextUIProvider>
					{children}
					<CenteredFooterWithSocialLinks />
				</NextUIProvider>
				<Toaster />
			</body>
		</html>
	);
}
