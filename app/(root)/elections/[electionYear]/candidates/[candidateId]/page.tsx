import prisma from "@/prisma/client";
import { Spacer } from "@nextui-org/spacer";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { Link } from "@nextui-org/link";
import { SparklesCore } from "@/components/ui/sparkles";
import Icon from "@/components/ui/Icon";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Divider } from "@nextui-org/divider";
import AnswerAccordion from "./AnswersAccordion";
import { title } from "process";
import { Tooltip } from "@nextui-org/tooltip";
import { Tabs, Tab } from "@nextui-org/tabs";
import ProfileTabs from "./AnswersAccordion copy";
import InstagramLogo from "@/public/assets/social-media/instagram.png";
import Image from "next/image";
import ViewCounter from "./ViewCounter";
import { auth } from "@/auth";

export default async function Component({ params }) {
	const session = await auth();
	const candidate = await prisma.candidate.findFirst({
		where: {
			OR: [
				{ id: params.candidateId },
				{
					election: {
						election_year: params.electionYear,
					},
					slug: params.candidateId,
				},
			],
		},
		include: {
			election: true,
		},
	});
	if (candidate && candidate.slug && candidate.slug !== params.candidateId) {
		redirect(`/elections/${params.electionYear}/candidates/${candidate.slug}`);
	}
	if (!candidate) {
		redirect(`/elections/${params.electionYear}`);
	}
	await prisma.candidate.update({
		where: {
			id: candidate.id,
		},
		data: {
			views: {
				increment: 1,
			},
		},
	});
	const fullName = `${candidate.officialName} ${candidate.officialSurname}`;

	return (
		<>
			<Button isIconOnly as={Link} href={`/elections/${candidate.election.election_year}/candidates`} className="absolute bg-content1/60 border m-5 rounded-full">
				<Icon icon="solar:alt-arrow-left-outline" width={24} className="text-white" />
			</Button>
			<section className="flex pwa:hidden max-w-5xl flex-col mx-auto  py-24 px-4">
				<div className="flex max-w-xl flex-col text-center mx-auto items-center">
					<Avatar showFallback className="h-40 w-40 mx-auto" isBordered src={`/api/users/${candidate.id}/avatar`} />
					<Spacer y={4} />
					<h2 className="font-medium text-white/70">
						{candidate.election.election_year} {!candidate.slogan && "Elections"} {candidate.slogan && `Head ${candidate.type == "GIRL" ? "Girl" : "Boy"} Candidate`}
					</h2>
					<h1 className="text-4xl font-medium tracking-tight">{fullName}</h1>
					<Spacer y={1} />
					<h2 className="text-large text-default-500">
						{!candidate.slogan && `Head ${candidate.type == "GIRL" ? "Girl" : "Boy"} Candidate`}
						{candidate.slogan}
					</h2>
					<Spacer y={3} />
					<div className="flex mx-auto gap-3 mb-0 mt-auto">
						{candidate.instagram && (
							<Tooltip showArrow content={`Instagram Account @${candidate.instagram}`}>
								<Button as={Link} isIconOnly isExternal href={`https://www.instagram.com/${candidate.instagram}`}>
									<Image width={20} height={20} src={InstagramLogo} alt="Instagram" />
								</Button>
							</Tooltip>
						)}
						{candidate.facebook && (
							<Tooltip showArrow content={`FaceBook Account @${candidate.facebook}`}>
								<Button as={Link} isIconOnly isExternal href={`https://www.facebook.com/${candidate.facebook}`}>
									<Icon className="text-blue-600" icon="bi:facebook" width={20} />
								</Button>
							</Tooltip>
						)}
						{candidate.twitter && (
							<Tooltip showArrow content={`Twitter Account @${candidate.twitter}`}>
								<Button as={Link} isIconOnly isExternal href={`https://twitter.com/${candidate.twitter}`}>
									<Icon className="text-blue-400" icon="bi:twitter" width={20} />
								</Button>
							</Tooltip>
						)}
						{candidate.snapchat && (
							<Tooltip showArrow content={`Snapchat Account @${candidate.snapchat}`}>
								<Button as={Link} isIconOnly isExternal href={`https://www.snapchat.com/${candidate.snapchat}`}>
									<Icon className="text-yellow-300" icon="mingcute:snapchat-fill" width={20} />
								</Button>
							</Tooltip>
						)}
						{candidate.youtube && (
							<Tooltip showArrow content={`Youtube Account @${candidate.youtube}`}>
								<Button as={Link} isIconOnly isExternal href={`https://www.youtube.com/${candidate.youtube}`}>
									<Icon className="text-red-600" icon="bi:youtube" width={20} />
								</Button>
							</Tooltip>
						)}
						{candidate.bereal && (
							<Tooltip showArrow content={`Bereal Account @${candidate.bereal}`}>
								<Button as={Link} isIconOnly isExternal href={`https://bere.al/${candidate.bereal}`}>
									<Icon className="text-white" icon="simple-icons:bereal" width={28} />
								</Button>
							</Tooltip>
						)}
						{candidate.website && (
							<Tooltip showArrow content={`Website www.${candidate.website}`}>
								<Button as={Link} isIconOnly isExternal href={`https://${candidate.website}`}>
									<Icon className="text-blue-300" icon="bi:globe" width={18} />
								</Button>
							</Tooltip>
						)}
					</div>
					<Spacer y={4} />
				</div>
				<ProfileTabs candidate={candidate} />
			</section>
			{session?.user?.admin && <ViewCounter views={candidate.views} />}
		</>
	);
}
