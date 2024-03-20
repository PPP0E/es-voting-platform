import React from "react";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@nextui-org/button";

import { cn } from "./cn";

enum CandidateType {
	"GIRL",
	"BOY",
}

export type TeamMember = {
	officialName: string;
	officialSurname: string;
	avatar: string;
	//EITHER GIRL OR BOY TYPE
	type: CandidateType;
	bio?: string;
	social: {
		twitter: string;
		linkedin: string;
		github?: string;
	};
};

export type TeamMemberCardProps = React.HTMLAttributes<HTMLDivElement> & TeamMember;

const TeamMemberCard = React.forwardRef<HTMLDivElement, TeamMemberCardProps>(({ electionYear, id, slug, avatar, officialName, officialSurname, type, slogan, instagram, facebook, twitter, bereal, snapchat, youtube, website, className, ...props }, ref) => (
	<div ref={ref} className={cn(`flex flex-col items-center hover:shadow-gray-900 hover:shadow-md duration-300 rounded-large bg-content1/60 px-4 py-4 text-center shadow-small`, className)} {...props}>
		<Avatar showFallback className="h-20 w-20" src={`/api/users/${id}/avatar`} />
		<h3 className="mt-2 font-medium">{officialName + " " + officialSurname || children}</h3>
		<span className="text-small text-default-500 ">{type == "GIRL" ? "Head Girl Candidate" : "Head Boy Candidate"}</span>
		<p className="mb-4 mt-2 text-default-600">{slogan}</p>
		<div className="flex gap-4 mb-0 mt-auto">
			{instagram && (
				<Link isExternal href={`https://www.instagram.com/${instagram}`}>
					<Icon className="text-default-400" icon="bi:instagram" width={20} />
				</Link>
			)}
			{facebook && (
				<Link isExternal href={`https://www.facebook.com/${facebook}`}>
					<Icon className="text-default-400" icon="bi:facebook" width={20} />
				</Link>
			)}
			{twitter && (
				<Link isExternal href={`https://twitter.com/${twitter}`}>
					<Icon className="text-default-400" icon="bi:twitter" width={20} />
				</Link>
			)}
			{snapchat && (
				<Link isExternal href={`https://www.snapchat.com/${snapchat}`}>
					<Icon className="text-default-400" icon="mingcute:snapchat-fill" width={20} />
				</Link>
			)}
			{youtube && (
				<Link isExternal href={`https://www.youtube.com/${youtube}`}>
					<Icon className="text-default-400" icon="bi:youtube" width={20} />
				</Link>
			)}
			{website && (
				<Link isExternal href={`https://${website}`}>
					<Icon className="text-default-400" icon="bi:globe" width={18} />
				</Link>
			)}
			{bereal && (
				<Link isExternal href={`https://bere.al/${bereal}`}>
					<Icon className="text-default-400" icon="simple-icons:bereal" width={28} />
				</Link>
			)}
		</div>
		<div className="w-full mt-6">
			<Button as={Link} href={`/elections/${electionYear}/candidates/${slug || id}`} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 min-w-full">
				View Candidate
			</Button>
		</div>
	</div>
));

TeamMemberCard.displayName = "TeamMemberCard";

export default TeamMemberCard;
