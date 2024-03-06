"use client";

import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Spacer, Chip, Divider, DropdownSection } from "@nextui-org/react";
import Image from "next/image";
import ESLogo from "@/public/assets/branding/logos/es-logo-white.svg";
import { signOut, useSession } from "next-auth/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Component({ faqsCount }) {
	const { data: session, status } = useSession();

	return (
		<Navbar
			classNames={{
				item: ["flex", "relative", "h-full", "items-center", "data-[active=true]:after:content-['']", "data-[active=true]:after:absolute", "data-[active=true]:after:bottom-0", "data-[active=true]:after:left-0", "data-[active=true]:after:right-0", "data-[active=true]:after:h-[2px]", "data-[active=true]:after:rounded-[2px]", "data-[active=true]:after:bg-primary"],
			}}
			className="pwa:block hidden"
			isBordered
			maxWidth="full">
			<NavbarContent className="">
				<NavbarBrand className="w-full">
					<Link href="/dashboard">
						<Image src={ESLogo} alt="The English School Logo" className="min-w-[200px]" width={210} />
					</Link>
					<Spacer x={2} />
					<Icon icon="solar:alt-arrow-right-linear" className="my-auto mr-1 hidden md:block" width={24} />
					<Chip size="sm" className="my-auto pt-1 hidden md:block px-2">
						Student Elections
					</Chip>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className="max-w-auto" justify="end">
				{status === "authenticated" && (
					<NavbarItem className="flex gap-2 align-middle justify-center">
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar isBordered as="button" className="transition-transform" showFallback size="sm" name={session.user.fullName.split(" ")[0].split("")[0] + session.user.fullName.split(" ")[1].split("")[0]} src={session.user.profilePictureUrl} />
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem key="profile" className="gap-2 disabled:!text-white">
									<p className="font-thin">Signed in as</p> <p className="font-semibold">{session.user.fullName}</p>
									{session.user.student == "student" && (
										<p className="font-semibold">
											{session.user.student.studentId} • {session.user.student.formClass}
										</p>
									)}
									{session.user.admin && (
										<>
											<p className="font-semibold">{session.user.email}</p>
											<p className="font-semibold">Admin</p>
										</>
									)}
								</DropdownItem>
								{session.user.candidate && (
									<DropdownItem variant="flat" href="/profile">
										Profile
									</DropdownItem>
								)}
								<DropdownItem color="danger" variant="flat" onPress={signOut}>
									Sign Out
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarItem>
				)}
			</NavbarContent>
		</Navbar>
	);
}
