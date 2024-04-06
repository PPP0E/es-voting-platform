import FaqsWithDivider from "@/nextui/FaqsWithDivider";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export const revalidate = 60; // 1 minute

export const metadata = {
	metadataBase: new URL("https://eselections.org"),
	title: "About the English School Student Elections",
	description: "Learn more about the student elections of The English School.",
	openGraph: {
		images: "/assets/og-image.jpg",
	},
};

export default async function Component() {
	const faqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	if (!faqs.length) redirect("/");
	return <FaqsWithDivider desktopTitle={<>About The English School Student Elections</>} mobileTitle="About the Elections" faqs={faqs} />;
}
