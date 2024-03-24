import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Dispatcher, request } from "undici";
import type { NextAuthConfig } from "next-auth";
import prisma from "@/prisma/client";
import { verifyPassword } from "@/lib/auth";

export const authConfig: NextAuthConfig = {
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 2,
	},
	providers: [
		CredentialsProvider({
			type: "credentials",
			name: "The English School",
			credentials: {
				username: { label: "username", type: "text", placeholder: "studentId or Email" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				let { username, password } = credentials;

				let adminUser: { fullName: string; email: string; password: string; id: string } | null = null;
				try {
					adminUser = await prisma.admin.findUnique({
						where: {
							email: username as string,
						},
					});
				} catch (error) {
					return null;
				}
				if (adminUser) {
					const isValid = await verifyPassword(password as string, adminUser.password);
					if (!isValid) {
						return null;
					}
					const userObject = { fullName: adminUser.fullName, email: adminUser.email, admin: { id: adminUser.id }, student: { studentId: username.replace("@englishschool.ac.cy", ""), yearGroup: "7" }, candidate: { id: username.replace("@englishschool.ac.cy", ""), type: "BOY" } };
					return userObject;
				}

				username = (username as string)
					.trim()
					.toLowerCase()
					.replace(/@englishschool.ac.cy$/, "");

				password = (password as string).trim();

				const isValidUsername = /^s\d{2}[1-7]\d{3}$/.test(username as string);

				if (!username || !password || !isValidUsername) {
					return null;
				}

				const email = `${username}@englishschool.ac.cy`;
				//////////////////////////LOGIN TO THE WEDUC PORTAL//////////////////////////
				let weducLoginData: Dispatcher.ResponseData, weducUserProfileLocation: Dispatcher.ResponseData, weducUserData: Dispatcher.ResponseData;

				try {
					weducLoginData = await request("https://app.weduc.co.uk/main/index/ajaxlogin", {
						method: "POST",
						body: `username=${email}&password=${password}`,
						headers: {
							Host: "app.weduc.co.uk",
							"Content-Type": "application/x-www-form-urlencoded",
							"Sec-Ch-Ua-Mobile": "?0",
						},
					});
				} catch (error) {
					return null;
				}
				//GET WEDUC UUID AND NAVIGATE TO PROFILE URL
				try {
					weducUserProfileLocation = await request("https://app.weduc.co.uk/user/profile/view/", {
						method: "GET",
						headers: {
							Host: "app.weduc.co.uk",
							Cookie: weducLoginData.headers["set-cookie"].split(";")[0],
							"Sec-Ch-Ua-Mobile": "?0",
						},
					});
				} catch (error) {
					return null;
				}
				//GET PROFILE PICTURE AND FORM CLASS
				try {
					weducUserData = await request(weducUserProfileLocation.headers.location.toString(), {
						method: "GET",
						headers: {
							Host: "app.weduc.co.uk",
							Cookie: (weducLoginData.headers["set-cookie"] as string).split(";")[0],
							"Sec-Ch-Ua-Mobile": "?0",
						},
					});
				} catch (error) {
					return null;
				}
				const weducUserDataText = await weducUserData.body.text();
				const formMatch = weducUserDataText.match(/"alias":"(.+?)"/);
				const nameMatch = weducUserDataText.match(/"name":"(.+?)","alias"/);
				const profilePictureMatch = weducUserDataText.match(/<img class="rounded profile-img" src="(.+?)">/);
				const fullName = nameMatch?.[1];
				const yearGroup = formMatch[1]?.split("")[0];
				const profilePictureUrl = profilePictureMatch?.[1];
				const studentId = username;
				//only years 3,4,5,6,7 are allowed to vote
				if (!yearGroup || !["3", "4", "5", "6", "7"].includes(yearGroup)) {
					return null;
				}
				const userObject = { fullName, email, profilePictureUrl, student: { studentId, yearGroup } };
				return userObject;
			},
		}),
	],
	trustHost: true,
	logger: {
		error: process.env.NODE_ENV === "production" ? () => {} : () => {},
		warn: () => {},
		debug: () => {},
	},
	callbacks: {
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
	pages: {
		signIn: "/login",
	},
};

export type AcceptedUser = {
	officialName: string;
	officialSurname: string;
	schoolEmail: string;
	studentId: string;
	yearGroup: string;
	profilePictureUrl: string;
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth(authConfig);

//<input type="text" id="profile_firstname" name="profile[firstname]" required="required" readonly="readonly" class="form-control" value="Berzan" />
//<input type="text" id="profile_lastname" name="profile[lastname]" required="required" readonly="readonly" class="form-control" value="Ozejder" />
//<input type="text" id="profile_email" name="profile[email]" class="form-control" value="s171040@englishschool.ac.cy" />
//<input type="text" id="profile_username" name="profile[username]" readonly="readonly" class="form-control" value="s171040" />
//get profile picture url                        <img class="rounded profile-img" src="https://app.weduc.co.uk/get/external/f/id/6bc6fd98741214b3dc702ccb13b31b2cd5fe3ddaccb71cbc4c6f67e6f093d926.jpg">
//"alias":"7 Yellow" get the class
