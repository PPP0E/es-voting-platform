"use client";

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Component({ children }) {
	const router = useRouter();
	return (
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider attribute="class" defaultTheme="dark">
				{children}
			</NextThemesProvider>
		</NextUIProvider>
	);
}
