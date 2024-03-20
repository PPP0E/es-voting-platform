"use client";

import { SessionProvider } from "next-auth/react";

export default function Component({ children }) {
	return <SessionProvider baseUrl="/">{children}</SessionProvider>;
}
