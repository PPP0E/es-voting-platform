"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Chip, Divider, Input, ScrollShadow, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useState, useTransition } from "react";
import { editCandidate } from "./actions";
import { toast } from "sonner";
import { flushSync } from "react-dom";
import { nameCase } from "@/lib/nameCase";
import { processSlogan, processBio, processSocialMediaLink, processVideoUrl, processSlug } from "@/lib/textOperations";
import ManagementProfilePictureFrame from "./ManagementProfilePictureFrame";

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
	const [speechUrl, setSpeechUrl] = useState("");
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
	// Exported general utility functions
	// onChange handlers remain internal to the file
	const handleSloganChange = (e: { target: { value: any } }) => setSlogan(processSlogan(e.target.value));
	const handleBioChange = (e: { target: { value: any } }) => setBio(processBio(e.target.value));
	const handleFacebookChange = (e: { target: { value: any } }) => setFacebook(processSocialMediaLink(e.target.value, "facebook.com/"));
	const handleTwitterChange = (e: { target: { value: any } }) => setTwitter(processSocialMediaLink(e.target.value, "twitter.com/"));
	const handleInstagramChange = (e: { target: { value: any } }) => setInstagram(processSocialMediaLink(e.target.value, "instagram.com/"));
	const handleYoutubeChange = (e: { target: { value: any } }) => setYoutube(processSocialMediaLink(e.target.value, "youtube.com/"));
	const handleBerealChange = (e: { target: { value: any } }) => setBereal(processSocialMediaLink(e.target.value, "bere.al/"));
	const handleSnapchatChange = (e: { target: { value: any } }) => setSnapchat(processSocialMediaLink(e.target.value, "snapchat.com/"));
	const handleWebsiteChange = (e: { target: { value: any } }) => setWebsite(processSocialMediaLink(e.target.value, ""));
	const handleVideoUrlChange = (e: { target: { value: any } }) => setVideoUrl(processVideoUrl(e.target.value));
	const handleSpeechUrlChange = (e: { target: { value: any } }) => setSpeechUrl(processVideoUrl(e.target.value));
	const handleSlugChange = (e: { target: { value: any } }) => setSlug(processSlug(e.target.value));

	const handleSlugBlur = (e: { target: { value: string } }) => {
		setSlug(slug.replace(/-$/, ""));
	};

	async function editCandidateHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", candidate.id);
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
		setInstagram(candidate.instagram ?? "");
		setFacebook(candidate.facebook ?? "");
		setTwitter(candidate.twitter ?? "");
		setBereal(candidate.bereal ?? "");
		setSnapchat(candidate.snapchat ?? "");
		setWebsite(candidate.website ?? "");
		setYoutube(candidate.youtube ?? "");
		setVideoUrl(candidate.video_url ?? "");
		setSpeechUrl(candidate.speech_url ?? "");
		setSlogan(candidate.slogan ?? "");
		setBio(candidate.bio ?? "");
		setSlug(candidate.slug ?? "");
	}, [searchParams.has("edit")]);

	const sloganDescriptionText = (
		<>
			{`${slogan ? slogan.split(/\s+/).length : "0"} words used ${slogan ? 10 - slogan.split(/\s+/).length : "10"} remaining.`}
			<br />
			{`${slogan.length} characters used and ${80 - slogan.length} remaining.`}
		</>
	);

	const bioDescriptionText = (
		<>
			{`${bio ? bio.split(/\s+/).length : "0"} words used ${bio ? 100 - bio.split(/\s+/).length : "750"} remaining.`}
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
		<Modal scrollBehavior="inside" isOpen={searchParams.has("edit")} onOpenChange={() => removeSearchParams({ edit: "" }, router)} placement="top">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Edit {candidate.officialName}</ModalHeader>
				<ModalBody>
					<ManagementProfilePictureFrame candidate={candidate} />
					<form className="space-y-2" id="main" action={editCandidateHandler}>
						<Chip variant="light">Personal Details</Chip>
						<Input onBlur={() => setFirstName(firstName.trim())} value={firstName} onChange={(e) => setFirstName(nameCase(e.target.value))} maxLength={100} isRequired size="lg" name="officialName" label="First Name" />
						<Input onBlur={() => setLastName(lastName.trim())} value={lastName} onChange={(e) => setLastName(nameCase(e.target.value))} maxLength={50} isRequired size="lg" name="officialSurname" label="Last Name" />
						<Input isInvalid={studentId && !studentId.match(/^\d{2}[1-7]\d{3}$/)} value={studentId} onValueChange={setStudentId} startContent="s" maxLength={6} isRequired size="lg" name="student_id" label="Student ID" />
						<Input value={slug} onChange={handleSlugChange} onBlur={handleSlugBlur} maxLength={50} size="lg" name="slug" label="Slug" />
						<Select defaultSelectedKeys={[candidate.type]} items={types} size="lg" name="type" label="Candidate Type" isRequired>
							{(type) => (
								<SelectItem key={type.key} value={type.key}>
									{type.value}
								</SelectItem>
							)}
						</Select>
						<Chip variant="light">Video</Chip>
						<Input startContent="youtu.be/" value={videoUrl} onChange={handleVideoUrlChange} maxLength={50} size="lg" name="video_url" label="Video URL" />
						<Input startContent="youtu.be/" value={speechUrl} onChange={handleSpeechUrlChange} maxLength={50} size="lg" name="speech_url" label="Speech URL" />
						<Chip variant="light">Social Media</Chip>
						<Input startContent="@" value={instagram} onChange={handleInstagramChange} maxLength={50} size="lg" name="instagram" label="Instagram" />
						<Input startContent="@" value={bereal} onChange={handleBerealChange} maxLength={50} size="lg" name="bereal" label="Bereal" />
						<Input startContent="@" value={snapchat} onChange={handleSnapchatChange} maxLength={50} size="lg" name="snapchat" label="Snapchat" />
						<Input startContent="youtu.be/" value={youtube} onChange={handleYoutubeChange} maxLength={50} size="lg" name="youtube" label="Youtube" />
						<Input startContent="facebook.com/" value={facebook} onChange={handleFacebookChange} maxLength={50} size="lg" name="facebook" label="Facebook" />
						<Input startContent="twitter.com/" value={twitter} onChange={handleTwitterChange} maxLength={50} size="lg" name="twitter" label="Twitter" />
						<Input startContent="https://" value={website} onChange={handleWebsiteChange} maxLength={50} size="lg" name="website" label="Website" />
						<Chip variant="light">Campaign Details</Chip>
						<Textarea value={slogan} onChange={handleSloganChange} description={sloganDescriptionText} maxLength={750} size="lg" label="Slogan" name="slogan" />
						<Textarea value={bio} onChange={handleBioChange} description={bioDescriptionText} maxLength={750} size="lg" label="Bio" name="bio" />
					</form>
				</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ edit: "" }, router)}>
						Close
					</Button>
					<Button isLoading={isLoading} color="primary" type="submit" form="main">
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
