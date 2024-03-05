"use client";

import type { IconProps } from "@iconify/react";

import React from "react";
import { Link, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Image from "next/image";
import ESLogo from "@/public/assets/branding/logos/es-logo-white.svg";

type SocialIconProps = Omit<IconProps, "icon">;

const navLinks = [
	{
		name: "Home",
		href: "https://www.englishschool.ac.cy",
	},
	{
		name: "About",
		href: "https://www.englishschool.ac.cy/about",
	},
	{
		name: "Weduc",
		href: "https://app.weduc.co.uk/main/index/index",
	},
	{
		name: "Contact",
		href: "https://www.englishschool.ac.cy/contact",
	},
	{
		name: "Careers",
		href: "https://www.englishschool.ac.cy/vacancies",
	},
	{
		name: "MEDIMUN",
		href: "https://www.medimun.org/home",
	},
];

const socialItems = [
	{
		name: "Facebook",
		href: "https://www.facebook.com/TheEnglishSchoolNicosia/",
		icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:facebook" />,
	},
	{
		name: "Instagram",
		href: "https://www.instagram.com/the_english_school_nicosia/",
		icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:instagram" />,
	},
	{
		name: "Twitter",
		href: "https://twitter.com/ESCyprus",
		icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:twitter" />,
	},
	{
		name: "YouTube",
		href: "https://www.youtube.com/channel/UCpSVVX__wHimCxyWA9_8WhA",
		icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:youtube-play" />,
	},
	{
		name: "GitHub",
		href: "https://github.com/medimun",
		icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:github" />,
	},
];

export default function Component() {
	const currentYear = new Date().getFullYear();
	return (
		<>
			<div className="p-3 w-full opacity-0 absolute">
				<div className="flex w-full rounded-xl flex-col">
					{" "}
					<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
						<div className="flex items-center justify-center">
							<Link href="/">
								<Image src={ESLogo} alt="The English School Logo" width={200} />
							</Link>
						</div>
						<Spacer y={4} />
						<div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
							{navLinks.map((item) => (
								<Link key={item.name} isExternal className="text-default-500" href={item.href} size="sm">
									{item.name}
								</Link>
							))}
						</div>
						<Spacer y={6} />
						<div className="flex justify-center gap-x-4">
							{socialItems.map((item) => (
								<Link key={item.name} isExternal className="text-default-400" href={item.href}>
									<span className="sr-only">{item.name}</span>
									<item.icon aria-hidden="true" className="w-5" />
								</Link>
							))}
						</div>
						<Spacer y={4} />
						<p className="mt-1 text-center text-small text-default-400">&copy; {currentYear} The English School. All rights reserved.</p>
					</div>
				</div>
			</div>
			<footer className="p-3 fixed w-full z-[-2] bottom-0">
				<div className="flex w-full flex-col">
					<div className="mx-auto flex w-full max-w-7xl rounded-xl flex-col items-center justify-center px-6 py-12 lg:px-8">
						<div className="flex items-center justify-center">
							<Link href="/">
								<Image src={ESLogo} alt="The English School Logo" width={200} />
							</Link>
						</div>
						<Spacer y={4} />
						<div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
							{navLinks.map((item) => (
								<Link key={item.name} isExternal className="text-default-500" href={item.href} size="sm">
									{item.name}
								</Link>
							))}
						</div>
						<Spacer y={6} />
						<div className="flex justify-center gap-x-4">
							{socialItems.map((item) => (
								<Link key={item.name} isExternal className="text-default-400" href={item.href}>
									<span className="sr-only">{item.name}</span>
									<item.icon aria-hidden="true" className="w-5" />
								</Link>
							))}
						</div>
						<Spacer y={4} />
						<p className="mt-1 text-center text-small text-default-400">&copy; {currentYear} The English School. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</>
	);
}
