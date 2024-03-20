"use server";

import "server-only";

import { Dispatcher, request } from "undici";

export async function weducLogin(username: string, password: string) {
	const email = `${username}@englishschool.ac.cy`;
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
				Cookie: (weducLoginData.headers["set-cookie"] as string).split(";")[0],
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

	const formClass = formMatch?.[1];
	const fullName = nameMatch?.[1];
	const yearGroup = formClass?.split(" ")[0];
	const profilePictureUrl = profilePictureMatch?.[1];
	const studentId = username;
	//only years 3,4,5,6,7 are allowed to vote
	return { fullName, email, profilePictureUrl, role: "student", student: { studentId, yearGroup } };
}
