"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";
import useScrollPosition from "@/lib/useScrollPosition";

type SpotlightProps = {
	className?: string;
	fill?: string;
};

export const Spotlight = ({ className, fill }: SpotlightProps) => {
	const [isMounted, setIsMounted] = React.useState(false);
	const pathname = usePathname();

	async function handlePathnameChange() {
		setIsMounted(false);
		await new Promise((resolve) => setTimeout(resolve, 100));
		if (!pathname.includes("dashboard")) {
			setIsMounted(true);
		}
	}
	React.useEffect(() => {
		handlePathnameChange();
	}, [pathname]);

	if (!isMounted) return null;
	return (
		<svg className={cn("animate-spotlight pointer-events-none absolute z-[1] pwa:hidden h-[169%] w-[138%] lg:w-[84%] opacity-0", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3787 2842" fill="none">
			<g filter="url(#filter)">
				<ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill={fill || "white"} fillOpacity="0.21"></ellipse>
			</g>
			<defs>
				<filter id="filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
					<feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
				</filter>
			</defs>
		</svg>
	);
};
