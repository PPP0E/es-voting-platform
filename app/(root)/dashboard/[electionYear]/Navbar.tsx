"use client";

import Icon from "@/components/ui/Icon";
import { Avatar, AvatarGroup, Button, Chip, Divider, ScrollShadow, Tab, Tabs, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Component({ electionYear }) {
	const pathname = usePathname();
	const basePath = `/dashboard/${electionYear}`;
	const items = [
		{ title: "Settings", href: basePath },
		{ title: "Results", href: `${basePath}/results` },
		{ title: "Candidates", href: `${basePath}/candidates` },
		{ title: "Application Questions", href: `${basePath}/questions` },
		{ title: "Candidate Stats", href: `${basePath}/stats` },

		/* 		{ title: "User Exceptions", href: `${basePath}/users` },
		 */
	];
	return (
		<ScrollShadow hideScrollBar className="-mx-2 flex w-full justify-between gap-8" orientation="horizontal">
			<Tabs selectedKey={pathname} aria-label="Navigation Tabs" radius="full" variant="light">
				{items.map((item) => (
					<Tab as={Link} href={item.href} key={item.href} title={item.title} />
				))}
			</Tabs>
		</ScrollShadow>
	);
}
