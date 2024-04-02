"use client";

import Icon from "@/components/ui/Icon";
import { Accordion, AccordionItem, Button, Chip, Link, ScrollShadow, Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { useState } from "react";
import InstagramLogo from "@/public/assets/social-media/instagram.png";
import Image from "next/image";

export function ProfileTabs({ candidate }) {
	const [selectedTab, setSelectedTab] = useState("about");
	const displaySocials = !!(candidate.instagram || candidate.facebook || candidate.twitter || candidate.snapchat || candidate.youtube || candidate.bereal || candidate.website);
	return (
		<div className="flex flex-col overflow-hidden justify-start">
			<ScrollShadow hideScrollBar className="flex max-w-full overflow-x-scroll flex-col justify-between gap-8" orientation="horizontal">
				<Tabs
					selectedKey={selectedTab}
					onSelectionChange={setSelectedTab}
					className="mx-auto"
					aria-label="Navigation Tabs"
					classNames={{
						cursor: "bg-default-200 shadow-none",
						tab: "h-[40px] px-4",
					}}
					radius="lg"
					variant="light">
					{candidate.bio && <Tab key="about" title="About Me" />}
					{candidate.video_url && <Tab key="video" title="Video" />}
					{candidate.speech_url && <Tab key="speech" title="Speech" />}
					{!!candidate.Answer.length && <Tab key="questions" title="Questions" />}
					{displaySocials && <Tab key="social" title="Social Media" />}
				</Tabs>
			</ScrollShadow>
			<Spacer y={2} />
			<Tabs
				className="!w-full"
				aria-label="Navigation Tabs"
				selectedKey={selectedTab}
				classNames={{
					cursor: "bg-default-200 shadow-none",
					tabList: "hidden",
				}}
				radius="full"
				variant="light">
				<Tab key="about" title="About Me">
					<h2 className="text-large text-default-500 max-w-[600px] mx-auto text-center">{candidate.bio}</h2>
				</Tab>
				<Tab key="questions" title="About Me">
					<div className="mx-auto max-w-[650px] flex flex-col gap-4">
						{candidate.Answer.map((answer, index) => (
							<div key={index} className="bg-content1/60 border rounded-xl p-4 gap-1 flex flex-col">
								<p className="bg-gradient-to-br flex from-foreground-800 to-foreground-500 bg-clip-text text-md font-semibold tracking-tight text-transparent dark:to-foreground-200">
									<span className="mt-[2.5px] block">{answer.question.title}</span>
								</p>
								<p className="text-default-600 mt-1 text-sm whitespace-pre-wrap">{answer.content}</p>
							</div>
						))}
					</div>
				</Tab>
				<Tab key="speech" title="Speech">
					<div className="mx-auto max-w-[500px]">
						<div className="relative pb-[56.25%] h-0">
							<iframe className="rounded-xl absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${candidate.speech_url}?amp;showinfo=0`} title="Candidate Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
						</div>
					</div>
				</Tab>
				<Tab key="video" title="Video">
					<div className="mx-auto max-w-[500px]">
						<div className="relative pb-[56.25%] h-0">
							<iframe className="rounded-xl absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${candidate.video_url}?amp;showinfo=0`} title="Candidate Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
						</div>
					</div>
				</Tab>
				<Tab key="team" title="Campaign Team" />
				<Tab key="social" title="social" className="w-full">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-[600px]">
						{candidate.instagram && (
							<div style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)" }} className="p-4 rounded-2xl flex flex-col text-left justify-start">
								<Icon className="text-white my-auto" icon="bi:instagram" width={22} />
								<Spacer y={1} />
								<p>Instagram</p>
								<p>@{candidate.instagram}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://www.instagram.com/${candidate.instagram}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
									Follow
								</Button>
							</div>
						)}
						{candidate.facebook && (
							<div className="p-4 rounded-2xl flex flex-col text-left justify-start bg-blue-600">
								<Icon className="text-white my-auto" icon="bi:facebook" width={22} />
								<Spacer y={1} />
								<p>FaceBook</p>
								<p>@{candidate.facebook}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://www.facebook.com/${candidate.facebook}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
									Follow
								</Button>
							</div>
						)}
						{candidate.twitter && (
							<div className="p-4 rounded-2xl flex flex-col text-left justify-start bg-blue-500">
								<div className="flex gap-2">
									<Icon className="text-white my-auto" icon="bi:twitter-x" width={22} />
								</div>
								<Spacer y={1} />
								<p>Twitter</p>
								<p>@{candidate.twitter}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://twitter.com/${candidate.twitter}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
									Follow
								</Button>
							</div>
						)}
						{candidate.snapchat && (
							<div className="p-4 rounded-2xl flex flex-col text-left justify-start bg-yellow-300 text-black">
								<Icon className="text-black my-auto" icon="bi:snapchat" width={22} />
								<Spacer y={1} />
								<p>Snapchat</p>
								<p>@{candidate.snapchat}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://www.snapchat.com/${candidate.snapchat}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
									Follow
								</Button>
							</div>
						)}
						{candidate.youtube && (
							<div className="p-4 rounded-2xl flex flex-col text-left justify-start bg-red-500">
								<Icon className="text-white my-auto" icon="bi:youtube" width={22} />
								<Spacer y={1} />
								<p>Youtube</p>
								<p>@{candidate.youtube}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://www.youtube.com/${candidate.youtube}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
									Follow
								</Button>
							</div>
						)}
						{candidate.bereal && (
							<div className="p-4 rounded-2xl flex flex-col text-left justify-start bg-black text-white">
								<Icon className="text-white my-auto" icon="simple-icons:bereal" width={26} />
								<Spacer y={1} />
								<p>Bereal</p>
								<p>@{candidate.bereal}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://bere.al/${candidate.bereal}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
									Follow
								</Button>
							</div>
						)}
						{candidate.website && (
							<div className="p-4 rounded-2xl flex flex-col text-left justify-start bg-white text-black">
								<Icon className="text-black my-auto" icon="bi:globe" width={22} />
								<Spacer y={1} />
								<p>Website</p>
								<p>www.{candidate.website}</p>
								<Spacer y={4} />
								<Button as={Link} href={`https://${candidate.website}`} target="_blank" className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-black/20 dark:bg-white/10 text-black w-auto">
									Visit
								</Button>
							</div>
						)}
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}

export default ProfileTabs;
