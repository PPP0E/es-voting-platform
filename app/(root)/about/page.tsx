import FaqsWithDivider from "@/nextui/FaqsWithDivider";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export const revalidate = 60; // 1 minute

export default async function Component() {
	const faqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	if (!faqs.length) redirect("/");
	return <FaqsWithDivider desktopTitle={<>About The English School Student Elections</>} mobileTitle="About the Elections" faqs={faqs} />;
}
