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
		async jwt({ token, user, trigger }) {
			if (user) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user;
			return session;
		},
	},
	providers: [],
	secret: process.env.AUTH_SECRET,
	logger: {
		error: () => {},
		warn: () => {},
		debug: () => {},
	},
});

export default auth((req) => {
	const { nextUrl } = req;
	const isAuthenticated = !!req.auth;

	if (nextUrl.pathname.includes("%23")) {
		let newUrl = nextUrl.pathname.replace("%23", "#");
		return NextResponse.redirect(new URL(newUrl, nextUrl.origin));
	}

	if (nextUrl.pathname.includes("@")) {
		const year = nextUrl.pathname.split("/")[1];
		const username = nextUrl.pathname.split("/")[2].replace("@", "");
		return NextResponse.redirect(new URL(`/elections/20${year}/candidates/${username}`, nextUrl.origin));
	}

	if (nextUrl.pathname === "/login" && isAuthenticated) {
		return NextResponse.redirect(new URL("/", nextUrl.origin));
	}

	if (nextUrl.pathname.includes("/dashboard") && !isAuthenticated) {
		return NextResponse.redirect(new URL(`/login?return=${nextUrl.pathname}`, nextUrl.origin));
	}

	if (nextUrl.pathname.includes("/dashboard") && isAuthenticated && !req.auth.user.admin) {
		return NextResponse.redirect(new URL("/", nextUrl.origin));
	}

	if (nextUrl.pathname.includes("/vote") && !isAuthenticated) {
		return NextResponse.redirect(new URL(`/login?return=${nextUrl.pathname}`, nextUrl.origin));
	}

	if (nextUrl.pathname.includes("/vote") && isAuthenticated && !req.auth.user.student) {
		return NextResponse.redirect(new URL("/", nextUrl.origin));
	}

	if (nextUrl.pathname.includes("/profile") && !isAuthenticated) {
		return NextResponse.redirect(new URL(`/login?return=${nextUrl.pathname}`, nextUrl.origin));
	}

	if (nextUrl.pathname.includes("/profile") && isAuthenticated && !req.auth.user.candidate) {
		return NextResponse.redirect(new URL("/", nextUrl.origin));
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
