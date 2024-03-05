"use client";

import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Spacer, Chip, Divider, Dropdown, DropdownSection } from "@nextui-org/react";
import Image from "next/image";
import { Link as NextLink } from "next/link";
import ESLogo from "@/public/assets/branding/logos/es-logo-white.svg";
import { signOut, useSession } from "next-auth/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Component({ faqsCount }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session, status } = useSession();
	const pathname = usePathname();

	const menuItems = ["Profile", "Dashboard", "Activity", "Analytics", "System", "Deployments", "My Settings", "Team Settings", "Help & Feedback", "Log Out"];
	const currentYear = new Date().getFullYear();
	return (
		<Navbar
			classNames={{
				item: ["flex", "relative", "h-full", "items-center", "data-[active=true]:after:content-['']", "data-[active=true]:after:absolute", "data-[active=true]:after:bottom-0", "data-[active=true]:after:left-0", "data-[active=true]:after:right-0", "data-[active=true]:after:h-[2px]", "data-[active=true]:after:rounded-[2px]", "data-[active=true]:after:bg-primary"],
			}}
			isBordered
			maxWidth="full"
			shouldHideOnScroll
			onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent className="">
				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
				<NavbarBrand className="w-full">
					<Link href="/">
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
				<NavbarItem as={Link} href="/" className="hidden md:flex" isActive={pathname == "/"}>
					Home
				</NavbarItem>
				{faqsCount > 0 && (
					<NavbarItem as={Link} href="/about" className="hidden md:flex" isActive={pathname == "/about"}>
						About
					</NavbarItem>
				)}
				<NavbarItem as={Link} href="/elections" className="hidden md:flex" isActive={pathname == "/elections"}>
					Elections
				</NavbarItem>
				{status == "authenticated" && session.user.role == "admin" && (
					<NavbarItem as={Link} href="/dashboard" className="hidden md:flex" isActive={pathname == "/dashboard"}>
						Dashboard
					</NavbarItem>
				)}

				{status !== "authenticated" && status !== "loading" && (
					<NavbarItem>
						<Link href="/login" color="primary">
							<button className="inline-flex h-10 rounded-full animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">Login</button>
						</Link>
						{/* 						<Button radius="full" as={Link} href="/login" color="primary" className="">
							Login
						</Button> */}
					</NavbarItem>
				)}
				{status === "authenticated" && (
					<NavbarItem className="flex gap-2 align-middle justify-center">
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar isBordered as="button" className="transition-transform" showFallback size="sm" name={session.user.fullName.split(" ")[0].split("")[0] + session.user.fullName.split(" ")[1].split("")[0]} src={session.user.profilePictureUrl} />
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem key="profile" className="gap-2 disabled:!text-white">
									<p className="font-thin">Signed in as</p> <p className="font-semibold">{session.user.fullName}</p>
									{session.user.role == "student" && (
										<p className="font-semibold">
											{session.user.student.studentId} • {session.user.student.formClass}
										</p>
									)}
									{session.user.role == "admin" && (
										<>
											<p className="font-semibold">{session.user.email}</p>
											<p className="font-semibold">Admin</p>
										</>
									)}
								</DropdownItem>
								{session.user.admin && (
									<DropdownItem variant="flat" href="/profile">
										Dashboard
									</DropdownItem>
								)}
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
			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link color={index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"} className="w-full" href="#" size="lg">
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
