import NextAuth from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const { auth } = NextAuth({
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	callbacks: {
		authorized({ auth }) {
			const isAuthenticated = !!auth?.user;
			return isAuthenticated;
		},
	},
	providers: [],
	logger: {
		error: () => {},
		warn: console.warn,
		debug: console.log,
	},
});

export default auth((req) => {
	const { nextUrl } = req;
	const isAuthenticated = !!req.auth;
	if (nextUrl.pathname === "/login" && isAuthenticated) {
		return NextResponse.redirect(new URL("/", nextUrl.origin));
	}
});

/* export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; */
