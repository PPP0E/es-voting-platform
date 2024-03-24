"use client";

import Icon from "@/components/ui/Icon";
import { Avatar, AvatarGroup, Button, Chip, Divider, ScrollShadow, Tab, Tabs, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Component() {
	const pathname = usePathname();
	return (
		<ScrollShadow hideScrollBar className="-mx-2 flex w-full justify-between gap-8" orientation="horizontal">
			<Tabs selectedKey={pathname} aria-label="Navigation Tabs" radius="full" variant="light">
				<Tab as={Link} href="/dashboard" key="/dashboard" title="Elections" />
				<Tab as={Link} href="/dashboard/faqs" key="/dashboard/faqs" title="Website FAQs" />
				<Tab as={Link} href="/dashboard/admins" key="/dashboard/admins" title="Admins" />
				<Tab as={Link} href="/dashboard/check" key="/dashboard/check" title="Ballot Check" className="md:hidden" />
			</Tabs>
		</ScrollShadow>
	);
}
