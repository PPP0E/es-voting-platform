"use client";

import { nameCase } from "@/lib/nameCase";
import { processBio, processSlogan, processSlug, processSocialMediaLink, processVideoUrl } from "@/lib/textOperations";
import { Avatar, Badge, Button, Card, CardBody, Chip, Input, ScrollShadow, Select, SelectItem, Spacer, Tab, Tabs, Textarea } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import ProfilePictureFrame from "./ProfilePictureFrame";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";
import { addCandidateAnswers, editBio, editSlogan, editSocials, editVideo } from "./actions";

export function ProfileForm({ selectedCandidate }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	//state
	const [profilePictureInput, setProfilePictureInput] = useState();
	//personal state
	const [isLoading, setIsLoading] = useState(false);
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

	async function editSloganHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", selectedCandidate.id);
		const res = await editSlogan(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		} else [toast.success(res?.message)];
		setIsLoading(false);
		router.refresh();
	}

	async function editBioHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", selectedCandidate.id);

		const res = await editBio(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		} else [toast.success(res?.message)];
		setIsLoading(false);
		router.refresh();
	}

	async function editVideohandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", selectedCandidate.id);
		const res = await editVideo(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		} else [toast.success(res?.message)];
		setIsLoading(false);
		router.refresh();
	}

	async function editSocialsHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", selectedCandidate.id);
		const res = await editSocials(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		} else [toast.success(res?.message)];
		setIsLoading(false);
		router.refresh();
	}

	async function editAnswersHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("electionYear", selectedCandidate.election.election_year);
		formData.append("candidateId", selectedCandidate?.id);
		const res = await addCandidateAnswers(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		} else {
			toast.success(res?.message);
		}
		setIsLoading(false);
		router.refresh();
	}

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

	useEffect(() => {
		if (!selectedCandidate) return;
		setInstagram(selectedCandidate.instagram ?? "");
		setFacebook(selectedCandidate.facebook ?? "");
		setTwitter(selectedCandidate.twitter ?? "");
		setBereal(selectedCandidate.bereal ?? "");
		setSnapchat(selectedCandidate.snapchat ?? "");
		setWebsite(selectedCandidate.website ?? "");
		setYoutube(selectedCandidate.youtube ?? "");
		setVideoUrl(selectedCandidate.video_url ?? "");
		setSlogan(selectedCandidate.slogan ?? "");
		setBio(selectedCandidate.bio ?? "");
	}, []);

	function Title({ title, description, children, action }) {
		return (
			<div className="flex flex-col gap-2 bg-content1/40 border rounded-2xl p-3">
				<div className="my-2">
					<p className="text-sm font-medium text-default-700 ml-1">{title}</p>
					<p className="text-xs font-normal text-default-400 ml-1">{description}</p>
				</div>
				<form action={action} className="flex flex-col gap-2">
					{children}
				</form>
			</div>
		);
	}

	return (
		<>
			<section className="flex max-w-5xl flex-col mx-auto my-4 items-center md:py-24 duration-300 px-4">
				<div className={cn("p-2 flex flex-col gap-4 md:w-[500px]")}>
					<Title title="Profile Picture">
						<ProfilePictureFrame isDisabled={!selectedCandidate.election.edit_photo} candidate={selectedCandidate} />
					</Title>
					<div className="flex flex-col gap-2 bg-content1/40 border rounded-2xl p-3">
						<div className="my-2">
							<p className="text-sm font-medium text-default-700 ml-1">Campaign Slogan</p>
							<p className="text-xs font-normal text-default-400 ml-1">Edit your campaign's information.</p>
						</div>
						<form action={editSloganHandler} className="flex flex-col gap-2">
							<Input isDisabled={!selectedCandidate.election.edit_bio} value={slogan} onChange={handleSloganChange} description={sloganDescriptionText} maxLength={750} size="lg" label="Slogan" name="slogan" />
							<Button isDisabled={!selectedCandidate.election.edit_bio || isLoading || slogan == selectedCandidate.slogan} type="submit" className="border bg-content1/60 md:ml-auto mt-1">
								Save
							</Button>
						</form>
					</div>
					<div className="flex flex-col gap-2 bg-content1/40 border rounded-2xl p-3">
						<div className="my-2">
							<p className="text-sm font-medium text-default-700 ml-1">Biography</p>
							<p className="text-xs font-normal text-default-400 ml-1">Tell us about yourself.</p>
						</div>
						<form action={editBioHandler} className="flex flex-col gap-2">
							<Textarea isDisabled={!selectedCandidate.election.edit_slogan} value={bio} onChange={handleBioChange} description={bioDescriptionText} maxLength={750} size="lg" label="Biography" name="bio" />
							<Button isDisabled={!selectedCandidate.election.edit_slogan || isLoading || bio == selectedCandidate.bio} type="submit" className="border bg-content1/60 md:ml-auto mt-1">
								Save
							</Button>
						</form>
					</div>
					<div className="flex flex-col gap-2 bg-content1/40 border rounded-2xl p-3">
						<div className="my-2">
							<p className="text-sm font-medium text-default-700 ml-1">Campaign Video</p>
							<p className="text-xs font-normal text-default-400 ml-1">Add a video to your campaign</p>
						</div>
						<form action={editVideohandler} className="flex flex-col gap-2">
							<Input isDisabled={!selectedCandidate.election.edit_socials} startContent="youtu.be/" value={videoUrl} onChange={handleVideoUrlChange} maxLength={50} size="lg" name="video_url" description="The video must be publicly accesible on YouTube" label="Video URL" />
							<Button type="submit" isDisabled={!selectedCandidate.election.edit_socials || isLoading} className="border bg-content1/60 md:ml-auto mt-1">
								Save
							</Button>
						</form>
					</div>
					<div className="flex flex-col gap-2 bg-content1/40 border rounded-2xl p-3">
						<div className="my-2">
							<p className="text-sm font-medium text-default-700 ml-1">Social Media</p>
							<p className="text-xs font-normal text-default-400 ml-1">Add your campaign's social media links.</p>
						</div>
						<form action={editSocialsHandler} className="flex flex-col gap-2">
							<Input isDisabled={!selectedCandidate.election.edit_socials} classNames={{ input: "" }} startContent="@" value={instagram} onChange={handleInstagramChange} maxLength={50} size="lg" name="instagram" label="Instagram" />
							<Input isDisabled={!selectedCandidate.election.edit_socials} className="w-full" startContent="@" value={bereal} onChange={handleBerealChange} maxLength={50} size="lg" name="bereal" label="Bereal" />
							<Input isDisabled={!selectedCandidate.election.edit_socials} className="w-full" startContent="@" value={snapchat} onChange={handleSnapchatChange} maxLength={50} size="lg" name="snapchat" label="Snapchat" />
							<Input isDisabled={!selectedCandidate.election.edit_socials} className="w-full" startContent="youtu.be/" value={youtube} onChange={handleYoutubeChange} maxLength={50} size="lg" name="youtube" label="Youtube" />
							<Input isDisabled={!selectedCandidate.election.edit_socials} className="w-full" startContent="facebook.com/" value={facebook} onChange={handleFacebookChange} maxLength={50} size="lg" name="facebook" label="Facebook" />
							<Input isDisabled={!selectedCandidate.election.edit_socials} className="w-full" startContent="twitter.com/" value={twitter} onChange={handleTwitterChange} maxLength={50} size="lg" name="twitter" label="Twitter" />
							<Input isDisabled={!selectedCandidate.election.edit_socials} className="w-full" startContent="https://" value={website} onChange={handleWebsiteChange} maxLength={50} size="lg" name="website" label="Website" />
							<Button type="submit" isDisabled={!selectedCandidate.election.edit_socials || isLoading} className="border bg-content1/60 md:ml-auto mt-1">
								Save
							</Button>
						</form>
					</div>
					<div className="flex flex-col gap-2 bg-content1/40 border rounded-2xl p-3">
						<div className="my-2">
							<p className="text-sm font-medium text-default-700 ml-1">Application Questions</p>
							<p className="text-xs font-normal text-default-400 ml-1">Add your campaign's social media links.</p>
						</div>
						<form action={editAnswersHandler} className="flex flex-col gap-2">
							<ul className="flex flex-col gap-4">
								{selectedCandidate.election.Question.map((question) => {
									const processedTitle = question.title.replace("#type", "Boy");
									const answer = selectedCandidate.Answer.find((answer) => answer?.question?.id === question?.id);
									return (
										<li key={question?.id}>
											<Textarea isDisabled={!selectedCandidate.election.edit_questions} defaultValue={answer?.content} description="500 words max" name={question?.id} label={question.title} />
										</li>
									);
								})}
							</ul>
							<Button type="submit" isDisabled={!selectedCandidate.election.edit_socials || isLoading} className="border bg-content1/60 md:ml-auto mt-1">
								Save
							</Button>
						</form>
					</div>
				</div>
			</section>
		</>
	);
}

/* model Election {
   id                String      @id @unique @default(uuid())
   election_date     String?
   election_year     String      @unique
   is_current        Boolean     @default(false)
   forceEnabled      Boolean     @default(false)
   autoEnabled       Boolean     @default(false)
   blocked           Boolean     @default(false)
   total_voters      Int?
   description       String?
   voting_start_time String?
   voting_end_time   String?
   publish_results   Boolean     @default(false)
   is_visible        Boolean     @default(false)
   //
   edit_bio          Boolean     @default(true)
   edit_slogan       Boolean     @default(true)
   edit_socials      Boolean     @default(true) //includes social media and video; speech is added by admin
   edit_photo        Boolean     @default(true)
   edit_questions    Boolean     @default(true)
   //
   Candidate         Candidate[]
   Question          Question[]
}
 */
