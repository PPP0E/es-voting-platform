import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Dispatcher, request } from "undici";

export type User = {
	officialName: string;
	officialSurname: string;
	schoolEmail: string;
	studentId: string;
	formClass: string;
	yearGroup: string;
	profilePictureUrl: string;
};

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	providers: [
		CredentialsProvider({
			type: "credentials",
			name: "The English School",
			credentials: {
				username: { label: "username", type: "text", placeholder: "studentId or Email" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				const { username, password } = credentials;

				let res: Dispatcher.ResponseData, profilePage: Dispatcher.ResponseData, weducLoginPage: Dispatcher.ResponseData, weducLoginData: Dispatcher.ResponseData, weducUserProfileLocation: Dispatcher.ResponseData, weducUserData: Dispatcher.ResponseData;
				//LOGIN TO THE CA PORTAL
				try {
					res = await request("https://ca.englishschool.ac.cy/login_check", {
						body: `_username=${(username as string).trim()}&_password=${(password as string).trim()}`,
						method: "POST",
						headers: {
							Host: "ca.englishschool.ac.cy",
							"Content-Type": "application/x-www-form-urlencoded",
						},
					});
				} catch (error) {
					return null;
				}
				//CHECK IF LOGIN PORTAL ALLOWED
				const allowed = res.headers.location == "/student/profile/";
				if (!allowed) {
					return null;
				}
				//GET STUDENT NAME AND SURNAME
				try {
					profilePage = await request("https://ca.englishschool.ac.cy/student/profile/", {
						method: "GET",
						headers: {
							Host: "ca.englishschool.ac.cy",
							"Content-Type": "application/x-www-form-urlencoded",
							Cookie: res.headers["set-cookie"],
						},
					});
				} catch (error) {
					return null;
				}
				//PARSE CA PORTAL DATA
				const body = await profilePage.body.text();
				const nameInput = body.match(/<input type="text" id="profile_firstname" name="profile\[firstname\]" required="required" readonly="readonly" class="form-control" value="(.+?)" \/>/);
				const surnameInput = body.match(/<input type="text" id="profile_lastname" name="profile\[lastname\]" required="required" readonly="readonly" class="form-control" value="(.+?)" \/>/);
				const emailInput = body.match(/<input type="text" id="profile_email" name="profile\[email\]" class="form-control" value="(.+?)" \/>/);
				const studentIdInput = body.match(/<input type="text" id="profile_username" name="profile\[username\]" readonly="readonly" class="form-control" value="(.+?)" \/>/);
				const officialName = nameInput?.[1];
				const officialSurname = surnameInput?.[1];
				const schoolEmail = emailInput?.[1];
				const studentId = studentIdInput?.[1];
				if (!officialName || !officialSurname || !schoolEmail || !studentId) {
					return null;
				}
				//GET PHPSESSID FROM WEDUC TO B ABLE TO SUBMIT A LOGIN FORM
				try {
					weducLoginPage = await request("https://app.weduc.co.uk", {
						method: "GET",
					});
				} catch (error) {
					return null;
				}
				//SUBMIT LOGIN FORM TO WEDUC
				try {
					weducLoginData = await request("https://app.weduc.co.uk/main/index/ajaxlogin", {
						method: "POST",
						body: `username=${schoolEmail}&password=${password}`,
						headers: {
							Host: "app.weduc.co.uk",
							"Content-Type": "application/x-www-form-urlencoded",
							Cookie: weducLoginPage.headers["set-cookie"].split(";")[0],
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
				const formClass = formMatch?.[1];
				const profilePictureMatch = weducUserDataText.match(/<img class="rounded profile-img" src="(.+?)">/);
				const profilePictureUrl = profilePictureMatch?.[1];
				console.log({ officialName, officialSurname, schoolEmail, studentId, formClass, yearGroup: formClass?.split(" ")[0], profilePictureUrl });
				return { officialName, officialSurname, schoolEmail, studentId, formClass, yearGroup: formClass?.split(" ")[0], profilePictureUrl };
			},
		}),
	],
	trustHost: true,
	logger: {
		error: process.env.NODE_ENV === "production" ? () => {} : console.log,
		warn: console.warn,
		debug: console.log,
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
});

//<input type="text" id="profile_firstname" name="profile[firstname]" required="required" readonly="readonly" class="form-control" value="Berzan" />
//<input type="text" id="profile_lastname" name="profile[lastname]" required="required" readonly="readonly" class="form-control" value="Ozejder" />
//<input type="text" id="profile_email" name="profile[email]" class="form-control" value="s171040@englishschool.ac.cy" />
//<input type="text" id="profile_username" name="profile[username]" readonly="readonly" class="form-control" value="s171040" />
//get profile picture url                        <img class="rounded profile-img" src="https://app.weduc.co.uk/get/external/f/id/6bc6fd98741214b3dc702ccb13b31b2cd5fe3ddaccb71cbc4c6f67e6f093d926.jpg">
//"alias":"7 Yellow" get the class
