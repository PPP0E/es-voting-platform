import prisma from "@/prisma/client";
import { Spacer } from "@nextui-org/spacer";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { Link } from "@nextui-org/link";
import Icon from "@/components/ui/Icon";
import AnswerAccordion from "./AnswersAccordion";
import { Tooltip } from "@nextui-org/tooltip";
import ProfileTabs from "./AnswersAccordion";
import InstagramLogo from "@/public/assets/social-media/instagram.png";
import Image from "next/image";
import ViewCounter from "./ViewCounter";
import { auth } from "@/auth";
import BackButton from "./BackButton";

export async function generateMetadata({ params }) {
	const candidate = await getData(params);
	const fullName = `${candidate.officialName} ${candidate.officialSurname}`;
	const title = `${fullName} - ${candidate.election.election_year} Elections Candidate`;
	const description = candidate.slogan || `Head ${candidate.type.toLowerCase()} candidate for the ${candidate.election.election_year} student elections of The English School.`;
	const image = `/api/users/${candidate.id}/avatar`;
	return {
		metadataBase: new URL("https://eselections.org"),
		title,
		description,
		image,
		openGraph: {
			images: `/api/users/${candidate.id}/avatar`,
		},
	};
}

async function getData(params) {
	let candidate;
	try {
		candidate = await prisma.candidate.findFirst({
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
				Answer: {
					include: {
						question: true,
					},
				},
			},
		});
	} catch (e) {
		redirect(`/elections/${params.electionYear}`);
	}
	if (candidate && candidate.slug && candidate.slug !== params.candidateId) {
		redirect(`/elections/${params.electionYear}/candidates/${candidate.slug}`);
	}
	if (!candidate) {
		redirect(`/elections/${params.electionYear}`);
	}
	return candidate;
}

export default async function Component({ params }) {
	const session = await auth();
	const candidate = await getData(params);
	if (!session?.user?.admin && !session?.user?.candidate) {
		try {
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
		} catch (e) {}
	}
	const fullName = `${candidate.officialName} ${candidate.officialSurname}`;

	return (
		<>
			<BackButton />
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
