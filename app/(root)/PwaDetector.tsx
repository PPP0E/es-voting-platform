"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Component() {
	const router = useRouter();
	const pathname = usePathname();
	useEffect(() => {
		const isInStandaloneMode = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone || document.referrer.includes("android-app://");
		if (isInStandaloneMode() && !(pathname.includes("/dashboard") || pathname.includes("/login"))) {
			router.push("/dashboard");
		}
	}, [pathname]);
	return;
}
