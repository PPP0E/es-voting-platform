"use client";

import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Spacer, Chip, Divider, DropdownSection } from "@nextui-org/react";
import Image from "next/image";
import { Link as NextLink } from "next/link";
import ESLogoWhite from "@/public/assets/branding/logos/es-logo-white.svg";
import ESLogoBlack from "@/public/assets/branding/logos/es-logo.svg";

import { signOut, useSession } from "next-auth/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { isVotingRunning } from "@/lib/isVotingRunning";
import ThemeSwitch from "@/nextui/theme-switch";

export default function Component({ faqsCount, currentElection }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session, status } = useSession();
	const pathname = usePathname();

	const isElectionRunning = isVotingRunning(currentElection);

	const fullName = session?.user?.fullName;
	const nameInitials = fullName
		?.split(" ")
		.map((name) => name[0])
		.join("");

	useEffect(() => {
		window.scrollTo(0, 0);
		setIsMenuOpen(false);
	}, [pathname]);

	return (
		<Navbar
			classNames={{
				item: ["flex", "relative", "h-full", "items-center", "data-[active=true]:after:content-['']", "data-[active=true]:after:absolute", "data-[active=true]:after:bottom-0", "data-[active=true]:after:left-0", "data-[active=true]:after:right-0", "data-[active=true]:after:h-[2px]", "data-[active=true]:after:rounded-[2px]", "data-[active=true]:after:bg-primary"],
			}}
			className="pwa:hidden"
			isBordered
			maxWidth="full"
			shouldHideOnScroll
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent className="">
				<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
				<NavbarBrand className="w-full">
					<Link href="/">
						<Image src={ESLogoWhite} alt="The English School Logo" className="min-w-[200px] hidden dark:block" width={210} />
						<Image src={ESLogoBlack} alt="The English School Logo" className="min-w-[200px] dark:hidden" width={210} />
					</Link>
					<Spacer x={2} />
					<Icon icon="solar:alt-arrow-right-linear" className="my-auto mr-1 hidden md:block" width={24} />
					{/* 					<Chip size="sm" className="my-auto pt-1 hidden md:block px-2">
						Student Elections
					</Chip> */}
					<p className="hidden md:block">Student Elections</p>
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
				{status === "authenticated" && session.user?.candidate && (
					<NavbarItem as={Link} href="/profile" className="hidden md:flex" isActive={pathname == "/profile"}>
						Profile
					</NavbarItem>
				)}
				{status === "authenticated" && session.user?.admin && (
					<NavbarItem as={Link} href="/dashboard" className="hidden md:flex" isActive={pathname == "/dashboard"}>
						Dashboard
					</NavbarItem>
				)}
				{status === "authenticated" && session.user?.student && isElectionRunning && (
					<NavbarItem as={Link} href="/vote" className="hidden md:flex" isActive={pathname == "/vote"}>
						<Button className="rounded-full text-md" size="sm" color="danger">
							<span className="animate-pulse px-2">Vote</span>
						</Button>
					</NavbarItem>
				)}
				{status !== "authenticated" && status !== "loading" && (
					<NavbarItem>
						<Link href="/login" color="primary">
							<button className="inline-flex h-10 rounded-full animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">Login</button>
						</Link>
					</NavbarItem>
				)}
				{status === "authenticated" && (
					<NavbarItem className="flex gap-2 align-middle justify-center">
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar isBordered as="button" className="transition-transform" showFallback size="sm" name={nameInitials} src={session.user.profilePictureUrl} />
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem key="profile" className="gap-2 disabled:!text-white">
									<p className="font-thin">Signed in as</p> <p className="font-semibold">{session.user.fullName}</p>
									{session.user.student && (
										<p className="font-light">
											{session.user.student.id} • {session.user.student.formGroup}
										</p>
									)}
									{session.user.admin && (
										<>
											{!session.user.student && <p className="font-light">{session.user.email}</p>}
											<p className="font-light">Admin</p>
										</>
									)}
									{session.user.candidate && <p className="font-light">Candidate</p>}
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
			<NavbarMenu>
				<NavbarMenuItem isActive={pathname == "/"}>
					<Link href="/" size="lg">
						Home
					</Link>
				</NavbarMenuItem>
				{faqsCount > 0 && (
					<NavbarMenuItem isActive={pathname == "/about"}>
						<Link href="/about" size="lg">
							About
						</Link>
					</NavbarMenuItem>
				)}
				<NavbarMenuItem>
					<Link size="lg" href="/elections">
						Elections
					</Link>
				</NavbarMenuItem>
				{status === "authenticated" && session.user?.candidate && (
					<NavbarMenuItem>
						<Link size="lg" href="/profile">
							Profile
						</Link>
					</NavbarMenuItem>
				)}
				{status === "authenticated" && session.user?.admin && (
					<NavbarMenuItem>
						<Link size="lg" href="/dashboard">
							Dashboard
						</Link>
					</NavbarMenuItem>
				)}
				{status === "authenticated" && (
					<NavbarMenuItem>
						<Link size="lg" color="danger" className="cursor-pointer" onPress={signOut}>
							Sign Out
						</Link>
					</NavbarMenuItem>
				)}
				{status === "authenticated" && session.user?.student && isElectionRunning && (
					<NavbarMenuItem>
						<Link href="/vote" className="w-full">
							<Button className="rounded-lg w-full text-md" size="lg" color="danger">
								<span className="animate-pulse px-2">Vote</span>
							</Button>
						</Link>
					</NavbarMenuItem>
				)}
			</NavbarMenu>
		</Navbar>
	);
}
