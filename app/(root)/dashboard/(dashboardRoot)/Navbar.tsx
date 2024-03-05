"use client";

import Icon from "@/components/ui/Icon";
import { Avatar, AvatarGroup, Button, Chip, Divider, ScrollShadow, Tab, Tabs, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
	const pathname = usePathname();
	useEffect(() => {
		console.log(pathname);
	}, [pathname]);
	return (
		<ScrollShadow hideScrollBar className="-mx-2 flex w-full justify-between gap-8" orientation="horizontal">
			<Tabs selectedKey={pathname} aria-label="Navigation Tabs" radius="full" variant="light">
				<Tab as={Link} href="/dashboard" key="/dashboard" title="Elections" />
				<Tab as={Link} href="/dashboard/faqs" key="/dashboard/faqs" title="FAQs" />
				<Tab as={Link} href="/dashboard/admins" key="/dashboard/admins" title="Admins" />
				<Tab as={Link} href="/dashboard/users" key="/dashboard/users" title="User Exceptions" />
			</Tabs>
		</ScrollShadow>
	);
}
