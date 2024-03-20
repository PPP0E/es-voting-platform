export const processSlogan = (text) => {
	return capitalizeEachWord(text.replace(/\s+/g, " ").split(" ").slice(0, 10).join(" ").slice(0, 80)).replace(/(\b[i]\b)|(?<=[\.\?!]\s)i/g, "I");
};

export const processBio = (text) => {
	return sentenceCase(text.replace(/\s+/g, " ").split(" ").slice(0, 100).join(" ").slice(0, 750)).replace(/(\b[i]\b)|(?<=[\.\?!]\s)i/g, "I");
};

export const processSocialMediaLink = (text, domain) => text.replace(domain, "").replace("www.", "").replace("https://", "").replace("http://", "").replace("watch?v=", "").replace(/\s+/g, "").slice(0, 50);
export const processVideoUrl = (text) => text.trim().replace("youtube.com/watch?v=", "").replace("youtu.be/", "").replace("https://", "").replace("http://", "").replace(/\s+/g, "").replace("www.", "").slice(0, 11);

export const processSlug = (text) =>
	text
		.replace(" ", "-")
		.replace("--", "-")
		.replace(/[^a-z0-9-]/g, "")
		.toLowerCase()
		.replace(/^[0-9-]/, "");

const sentenceCase = (str: string) =>
	str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
		return c.toUpperCase();
	});

const capitalizeEachWord = (str: string) =>
	str.toLowerCase().replace(/\b\w/g, function (c) {
		return c.toUpperCase();
	});
