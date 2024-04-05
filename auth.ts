import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Dispatcher, request } from "undici";
import type { NextAuthConfig } from "next-auth";
import prisma from "@/prisma/client";
import { verifyPassword } from "@/lib/auth";
import { $Enums } from "@prisma/client";

function isEmptyObject(obj) {
	return Object.keys(obj).length === 0;
}

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
				let { username, password } = credentials as Partial<Record<"username" | "password", string>>;

				password = password.trim();
				username = username
					.trim()
					.toLowerCase()
					.replace(/@englishschool.ac.cy$/, "");

				if (!username || !password) return null;
				const isSchoolId = /^s\d{2}[1-7]\d{3}$/.test(username as string);
				let studentUserObject: { fullName: string; email: string; profilePictureUrl: string }, studentObject: { id: string; yearGroup: string; formGroup: string };
				let adminUserObject: { fullName: any; email: any }, adminObject: { id: any }, adminQuery: { password: any; fullName: any; email: any; id: any };
				let candidateUserObject: { fullName: string; email: any; password: any; id: any }, candidateObject: { id: any }, candidateQuery: { officialName: any; officialSurname: any; schoolEmail?: any; password?: any; id: any; slug?: string; type?: $Enums.CandidateType; student_id?: string; bio?: string; slogan?: string; instagram?: string; facebook?: string; twitter?: string; bereal?: string; snapchat?: string; website?: string; youtube?: string; video_url?: string; speech_url?: string; photo?: string; file?: string; views?: number; election_id?: string };

				const studentEmail = `${username}@englishschool.ac.cy`;
				/*-----INIT-----*/

				/*-----ADMIN-----*/
				adminQuery = await prisma.admin.findFirst({
					where: {
						OR: [{ email: username }, { email: studentEmail }],
					},
				});
				if (adminQuery) {
					const isValid = await verifyPassword(password as string, adminQuery.password);
					if (isValid) {
						adminUserObject = { fullName: adminQuery.fullName, email: adminQuery.email };
						adminObject = { id: adminQuery.id };
					}
				}
				/* 				const currentElectionId = await prisma.election.findFirst({
					where: { is_current: true },
					select: { id: true },
				}); */

				let weducLoginData: Dispatcher.ResponseData, weducUserProfileLocation: Dispatcher.ResponseData, weducUserData: Dispatcher.ResponseData;
				const headers = { Host: "app.weduc.co.uk", "Sec-Ch-Ua-Mobile": "?0" };
				if (isSchoolId) {
					try {
						weducLoginData = await request("https://app.weduc.co.uk/main/index/ajaxlogin", {
							method: "POST",
							body: `username=${studentEmail}&password=${password}`,
							headers: {
								...headers,
								"Content-Type": "application/x-www-form-urlencoded",
							},
						});
						weducUserProfileLocation = await request("https://app.weduc.co.uk/user/profile/view/", {
							method: "GET",
							headers: {
								...headers,
								Cookie: weducLoginData.headers["set-cookie"].split(";")[0],
							},
						});
						weducUserData = await request(weducUserProfileLocation.headers.location.toString(), {
							method: "GET",
							headers: {
								...headers,
								Cookie: (weducLoginData.headers["set-cookie"] as string).split(";")[0],
							},
						});
					} catch (error) {
						return null;
					}

					const weducUserDataText = await weducUserData.body.text();

					const formMatch = weducUserDataText.match(/"alias":"(.+?)"/);
					const yearGroup = formMatch?.[1]?.split("")?.[0];
					const isStudent = yearGroup && ["3", "4", "5", "6", "7"].includes(yearGroup);

					if (isStudent) {
						const nameMatch = weducUserDataText.match(/"name":"(.+?)","alias"/);
						const profilePictureMatch = weducUserDataText.match(/<img class="rounded profile-img" src="(.+?)">/);

						const fullName = nameMatch?.[1];
						const formGroup = formMatch[1]?.replace(" ", "").slice(0, 2);
						const profilePictureUrl = profilePictureMatch?.[1];
						const studentId = username;
						const email = studentEmail;

						studentUserObject = { fullName, email, profilePictureUrl };
						studentObject = { id: studentId, yearGroup, formGroup };

						try {
							candidateQuery = await prisma.candidate.findFirst({
								where: {
									student_id: username as string,
								},
							});
							if (!adminObject || !adminUserObject) {
								adminQuery = await prisma.admin.findFirst({
									where: { OR: [{ email: username }, { email: studentEmail }] },
								});
								if (adminQuery) {
									adminObject = { id: adminQuery.id };
									adminUserObject = { fullName: adminQuery.fullName, email: adminQuery.email };
								}
							}
						} catch (error) {
							return null;
						}
						if (candidateQuery) {
							candidateUserObject = { fullName: candidateQuery.officialName + " " + candidateQuery.officialSurname, email: candidateQuery.schoolEmail, password: candidateQuery.password, id: candidateQuery.id };
							candidateObject = { id: candidateQuery.id };
						}
					}
				}

				if (!studentUserObject && !adminUserObject && !candidateUserObject) return null;
				if (studentUserObject && !studentObject) return null;
				if (adminUserObject && !adminObject) return null;
				if (candidateUserObject && !candidateObject) return null;
				if (!studentUserObject && studentObject) return null;
				if (!adminUserObject && adminObject) return null;
				if (!candidateUserObject && candidateObject) return null;

				let userObject = studentUserObject || adminUserObject || candidateUserObject;

				let userAttributes = {};
				if (studentObject) userAttributes = { student: studentObject, ...userAttributes };
				if (adminObject) userAttributes = { admin: adminObject, ...userAttributes };
				if (candidateObject) userAttributes = { candidate: candidateObject, ...userAttributes };

				const user = { ...userObject, ...userAttributes };
				if (!user || isEmptyObject(user)) return null;
				return user;
			},
		}),
	],
	trustHost: true,
	logger: {
		error: () => {},
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
	secret: process.env.AUTH_SECRET,
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
