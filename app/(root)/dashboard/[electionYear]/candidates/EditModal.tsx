"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useState, useTransition } from "react";
import { editCandidate } from "./actions";
import { toast } from "sonner";
import { flushSync } from "react-dom";
import { nameCase } from "@/lib/nameCase";

export default function Component({ candidate }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	//state
	//personal state
	const [isLoading, setIsLoading] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [studentId, setStudentId] = useState("");
	//video state
	const [videoUrl, setVideoUrl] = useState("");
	//social media state
	const [instagram, setInstagram] = useState("");
	const [facebook, setFacebook] = useState("");
	const [twitter, setTwitter] = useState("");
	const [bereal, setBereal] = useState("");
	const [snapchat, setSnapchat] = useState("");
	const [website, setWebsite] = useState("");
	const [youtube, setYoutube] = useState("");
	//other state
	const [bio, setBio] = useState("");
	const [slogan, setSlogan] = useState("");
	const [slug, setSlug] = useState("");

	//functions
	//input handlers
	const handleBioChange = (e: { target: { value: string } }) => setBio(e.target.value.replace(/\s+/g, " ").replace("  ", " ").split(" ").slice(0, 101).join(" ").slice(0, 750));
	const handleSloganChange = (e: { target: { value: string } }) => setSlogan(sentenceCase(e.target.value.replace(/\s+/g, " ").replace("  ", " ").split(" ").slice(0, 11).join(" ").slice(0, 80)));
	const handleFacebookChange = (e: { target: { value: string } }) => setFacebook(e.target.value.replace("facebook.com/", "").replace("www.", "").replace("https://", "").replace("http://", "").replace(/\s+/g, "").slice(0, 50));
	const handleTwitterChange = (e: { target: { value: string } }) => setTwitter(e.target.value.replace("twitter.com/", "").replace("www.", "").replace("https://", "").replace("http://", "").replace(/\s+/g, "").slice(0, 50));
	const handleInstagramChange = (e: { target: { value: string } }) => setInstagram(e.target.value.replace("@", "").replace("www.", "").replace("https://", "").replace("http://", "").replace("instagram.com/", "").replace(/\s+/g, "").slice(0, 50));
	const handleYoutubeChange = (e: { target: { value: string } }) => setYoutube(e.target.value.replace("youtube.com/", "").replace("youtu.be/", "").replace("@", "").replace("www.", "").replace("https://", "").replace("http://", "").replace(/\s+/g, "").slice(0, 50));
	const handleBerealChange = (e: { target: { value: string } }) => setBereal(e.target.value.replace("@", "").replace("www.", "").replace("https://", "").replace("http://", "").replace("bere.al/", "").replace(/\s+/g, "").slice(0, 50));
	const handleSnapchatChange = (e: { target: { value: string } }) => setSnapchat(e.target.value.replace("snapchat.com/", "").replace("www.", "").replace("https://", "").replace("http://", "").replace(/\s+/g, "").slice(0, 50));
	const handleWebsiteChange = (e: { target: { value: string } }) => setWebsite(e.target.value.replace("https://", "").replace("http://", "").replace(/\s+/g, "").slice(0, 50));
	const handleVideoUrlChange = (e: { target: { value: string } }) => setVideoUrl(e.target.value.trim().replace("youtube.com/watch?v=", "").replace("youtu.be/", "").replace("https://", "").replace("http://", "").replace(/\s+/g, "").replace("www.", "").slice(0, 11));
	const handleSlugChange = (e: { target: { value: string } }) =>
		setSlug(
			e.target.value
				.replace(" ", "-")
				.replace("--", "-")
				.replace(/[^a-z-]/g, "")
				.toLowerCase()
		);

	const sentenceCase = (str: string) =>
		str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
			return c.toUpperCase();
		});

	async function editCandidateHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		const res = await editCandidate(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		removeSearchParams({ edit: "" }, router);
		router.refresh();
	}

	/* 
	model Candidate {
		id              String          @id @unique @default(uuid())
		officialName    String
		officialSurname String
		slug            String?
		type            CandidateType
		//
		student_id      String?
		//
		bio             String?
		slogan          String?
		//
		instagram       String?
		facebook        String?
		twitter         String?
		bereal          String?
		snapchat        String?
		website         String?
		youtube         String?
		//
		video_url       String?
		//
		photo           String?
		file            String?
	
		@@unique([election_id, student_id])
		@@unique([election_id, slug])
	} */

	useEffect(() => {
		if (!candidate) return;
		setFirstName(candidate.officialName);
		setLastName(candidate.officialSurname);
		setStudentId(candidate.student_id.replace("s", ""));
		setInstagram(candidate.instagram);
		setFacebook(candidate.facebook);
		setTwitter(candidate.twitter);
		setBereal(candidate.bereal);
		setSnapchat(candidate.snapchat);
		setWebsite(candidate.website);
		setYoutube(candidate.youtube);
	}, [searchParams.has("edit")]);

	const sloganDescriptionText = (
		<>
			{`${slogan.split(/\s+/).length - 1} words used ${10 - slogan.split(/\s+/).length + 1} remaining.`}
			<br />
			{`${slogan.length} characters used and ${80 - slogan.length} remaining.`}
		</>
	);

	const bioDescriptionText = (
		<>
			{`${bio.split(/\s+/).length - 1} words used ${100 - bio.split(/\s+/).length + 1} remaining.`}
			<br />
			{`${bio.length} characters used and ${750 - bio.length} remaining.`}
		</>
	);

	const types = [
		{ key: "GIRL", value: "Head Girl" },
		{ key: "BOY", value: "Head Boy" },
	];

	if (!candidate) return;

	return (
		<Modal scrollBehavior="inside" isOpen={searchParams.has("edit")} onOpenChange={() => removeSearchParams({ edit: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Edit {candidate.officialName}</ModalHeader>
				<ModalBody id="main" as="form" className="text-sm" action={editCandidateHandler}>
					Personal Details
					<Input onBlur={() => setFirstName(firstName.trim())} value={firstName} onChange={(e) => setFirstName(nameCase(e.target.value))} maxLength={100} isRequired size="lg" name="officialName" label="First Name" />
					<Input onBlur={() => setLastName(lastName.trim())} value={lastName} onChange={(e) => setLastName(nameCase(e.target.value))} maxLength={50} isRequired size="lg" name="officialSurname" label="Last Name" />
					<Input isInvalid={studentId && !studentId.match(/^\d{2}[1-7]\d{3}$/)} value={studentId} onValueChange={setStudentId} startContent="s" maxLength={6} isRequired size="lg" name="student_id" label="Student ID" />
					<Input value={slug} onChange={handleSlugChange} maxLength={50} size="lg" name="slug" label="Slug" />
					<Select items={types} size="lg" name="type" label="Candidate Type" isRequired>
						{(type) => (
							<SelectItem key={type.key} value={type.key}>
								{type.value}
							</SelectItem>
						)}
					</Select>
					Video
					<Input startContent="youtu.be/" value={videoUrl} onChange={handleVideoUrlChange} maxLength={50} size="lg" name="video_url" label="Video URL" />
					Social Media
					<Input startContent="@" value={instagram} onChange={handleInstagramChange} maxLength={50} size="lg" name="instagram" label="Instagram" />
					<Input startContent="@" value={bereal} onChange={handleBerealChange} maxLength={50} size="lg" name="bereal" label="Bereal" />
					<Input startContent="@" value={snapchat} onChange={handleSnapchatChange} maxLength={50} size="lg" name="snapchat" label="Snapchat" />
					<Input startContent="youtube.com/" value={youtube} onChange={handleYoutubeChange} maxLength={50} size="lg" name="youtube" label="Youtube" />
					<Input startContent="facebook.com/" value={facebook} onChange={handleFacebookChange} maxLength={50} size="lg" name="facebook" label="Facebook" />
					<Input startContent="twitter.com/" value={twitter} onChange={handleTwitterChange} maxLength={50} size="lg" name="twitter" label="Twitter" />
					<Input startContent="https://" value={website} onChange={handleWebsiteChange} maxLength={50} size="lg" name="website" label="Website" />
					Campaign Details
					<Textarea value={slogan} onChange={handleSloganChange} description={sloganDescriptionText} maxLength={750} size="lg" label="Slogan" name="slogan" />
					<Textarea value={bio} onChange={handleBioChange} description={bioDescriptionText} maxLength={750} size="lg" label="Bio" name="bio" />
				</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ edit: "" }, router)}>
						Close
					</Button>
					<Button isLoading={isLoading} color="primary" type="submit" form="main">
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
