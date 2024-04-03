"use client";

import type { IconProps } from "@iconify/react";

import React from "react";
import { Link, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import Image from "next/image";
import ESLogoWhite from "@/public/assets/branding/logos/es-logo-white.svg";
import ESLogoBlack from "@/public/assets/branding/logos/es-logo.svg";
import ThemeSwitch from "./theme-switch";
import { useTheme } from "next-themes";

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

	const [height, setHeight] = React.useState("264px");
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		const footer = document.getElementById("footer");
		setHeight(footer.clientHeight + "px");
	}, []);

	return (
		<>
			<ThemeSwitch onChange={(e) => setTheme(e.target.value)} className="bottom-2 bg-content1/60 border rounded-full p-[2px] z-[2] right-2 fixed" />
			<div style={{ height: height }} className="p-3 w-full pwa:hidden opacity-0 absolute"></div>
			<footer id="footer" className="p-3 fixed pwa:hidden w-full z-[-2] bottom-0">
				<div className="flex w-full flex-col">
					<div className="mx-auto flex w-full max-w-7xl rounded-xl flex-col items-center justify-center px-6 py-12 lg:px-8">
						<div className="flex items-center justify-center">
							<Link href="/">
								<Image src={ESLogoWhite} alt="The English School Logo" className="hidden dark:block" width={200} />
								<Image src={ESLogoBlack} alt="The English School Logo" className="dark:hidden" width={200} />{" "}
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
