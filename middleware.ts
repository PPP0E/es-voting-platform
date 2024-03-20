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
	logger: {
		error: console.error,
		warn: console.warn,
		debug: console.log,
	},
});

export default auth((req) => {
	const { nextUrl } = req;
	const isAuthenticated = !!req.auth;
	console.log(req.auth);

	if (nextUrl.pathname === "/login" && isAuthenticated) {
		return NextResponse.redirect(new URL("/", nextUrl.origin));
	}
	if (nextUrl.pathname.includes("/dashboard") && (!isAuthenticated || !req.auth.user.admin)) {
		return NextResponse.redirect(new URL("/login", nextUrl.origin));
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
