"use client";

import { Avatar, Button, Spacer } from "@nextui-org/react";
import { memo, useEffect, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { cn } from "@/lib/cn";
import { useSession } from "next-auth/react";
import Icon from "@/components/ui/Icon";
import Image from "next/image";
import Confirm from "@/public/assets/confirm.gif";
import Confetti from "@/components/ui/confetti";
import useWindowDimensions from "@/lib/useWindowDimension";
import ReactConfetti from "react-confetti";
import QRCode from "react-qr-code";
import { vote } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VoteSelector({ currentElection, initialPage = 1, votes }) {
	const countDown = 15;
	const [viewBallotIds, setViewBallotIds] = useState(false);
	const [seconds, setSeconds] = useState(countDown);
	const [selectedGirl, setSelectedGirl] = useState(null);
	const [selectedBoy, setSelectedBoy] = useState(null);
	const girlCandidates = currentElection.Candidate.filter((c) => c.type == "GIRL");
	const boyCandidates = currentElection.Candidate.filter((c) => c.type == "BOY");
	const { width, height } = useWindowDimensions();
	const { data: session, status } = useSession();
	const router = useRouter();

	async function voteHandler(formData: FormData) {
		const res = await vote(formData);
		if (res) {
			if (res?.ok) toast.success(res.message);
			if (!res?.ok) toast.error(res.message);
			return;
		}
	}

	useEffect(() => {
		let interval = null;
		// When viewBallotIds is true, start the countdown
		if (viewBallotIds) {
			interval = setInterval(() => {
				setSeconds((seconds) => seconds - 1);
			}, 1000);
		}
		// When viewBallotIds is false or seconds reach 0, reset everything
		if (!viewBallotIds || seconds === 0) {
			clearInterval(interval);
			setViewBallotIds(false);
			setSeconds(countDown); // Reset seconds for the next time viewBallotIds is set to true
		}
		// Cleanup function to clear the interval
		return () => clearInterval(interval);
	}, [viewBallotIds, seconds]);

	//repeat every 10 seconds after mounting
	useEffect(() => {
		const interval = setInterval(() => {
			router.refresh();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	const MemoAvatar = memo(({ id }) => {
		return <Avatar className="ml-2 rounded-3xl" isBordered showFallback size="lg" src={`/api/users/${id}/avatar`} />;
	});

	function VoteSection({ cadidates, text, get, set, name }) {
		return (
			<div className="bg-neutral-900/50 p-4 rounded-2xl border">
				<h2 className="font-medium text-center text-white/70 text-lg">{text}</h2>
				<Spacer y={3} />
				<RadioGroup name={name} value={get} onValueChange={set} isRequired classNames={{ base: "" }}>
					<div className="grid grid-cols-1 gap-4">
						{cadidates.map((candidate) => {
							const fullName = candidate.officialName + " " + candidate.officialSurname;
							return (
								<Radio
									key={candidate.id}
									value={candidate.id}
									classNames={{
										wrapper: "animate-shimmer",
										base: cn(`flex w-[420px] flex-row items-center m-0 hover:shadow-gray-900 duration-300 min-w-full max-w-full rounded-large bg-content1/60 p-4 text-center shadow-small`),
									}}>
									<div className="flex gap-4">
										<MemoAvatar id={candidate.id} />
										<div className="flex flex-col items-start text-left my-auto">
											<h2 className="text-xl font-medium text-gray-800 dark:text-white/70 truncate">{fullName}</h2>
										</div>
									</div>
								</Radio>
							);
						})}
					</div>
				</RadioGroup>
			</div>
		);
	}

	if (status === "loading") return <div className="p-4 bg-content1/60 w-full text-center border rounded-xl">Loading</div>;
	if (!session) return <div>Unauthorized</div>;
	if (initialPage === 1)
		return (
			<Layout bigTitle="Cast Your Ballot" smallTitle={`${currentElection.election_year} Student Elections`}>
				<form className="flex flex-col items-center" action={voteHandler}>
					<Spacer y={5} />
					<VoteSection cadidates={girlCandidates} text={`Select a Head Girl Candidate`} get={selectedGirl} set={setSelectedGirl} name="GIRL" />
					<Spacer y={5} />
					<VoteSection cadidates={boyCandidates} text={`Select a Head Boy Candidate`} get={selectedBoy} set={setSelectedBoy} name="BOY" />
					<Spacer y={5} />
					<button disabled={!(selectedGirl && selectedBoy)} className={`inline-flex h-12 w-full rounded-2xl items-center justify-center border border-slate-800 px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${selectedGirl && selectedBoy && "animate-shimmer bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]"}`}>
						{!(selectedGirl && selectedBoy) ? "You need to choose 2 candidates" : "Vote"}
					</button>
				</form>
			</Layout>
		);
	const votesObject = `${votes[0].id}#${votes[1]?.id ? votes[1].id : ""}`;
	if (initialPage === 2)
		return (
			<Layout bigTitle="You've Voted" smallTitle={`${currentElection.election_year} Student Elections`}>
				<ReactConfetti numberOfPieces={30} width={width} height={height} />
				<div className="border shadow-lg shadow-content1 dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] relative z-[10000] animate-shimmer bg-[length:200%_100%] p-4 rounded-2xl bg-content1/60 flex flex-col gap-1 text-center max-w-[450px]">
					<p className="text-sm">If someone else has voted on your behalf contact us.</p>
					<Image alt="Tick" src={Confirm} unoptimized className="select-none my-[-64px]" />
					<div onClick={() => setViewBallotIds(!viewBallotIds)} className="p-3 bg-content1/60 select-none cursor-pointer border rounded-xl">
						{!viewBallotIds && <p className="text-sm">View Ballot Confirmation Code</p>}
						{viewBallotIds && (
							<div className="flex gap-4 flex-col">
								<p className="text-white mt-1">Hiding in {seconds}s</p>
								<div className="mx-auto bg-white p-2 rounded-lg">
									<QRCode size={150} value={votesObject} className="mx-auto" />
								</div>
								<i className="text-sm font-thin mb-1">Do not share with other students.</i>
							</div>
						)}
					</div>
				</div>
			</Layout>
		);
	return (
		<div className="flex flex-col items-center">
			<h2 className="text-3xl font-medium text-white/70">Select a Candidate with students</h2>
			<Spacer y={2} />
			<div className="flex flex-col items-center"></div>
		</div>
	);
}

function Layout({ children, smallTitle, bigTitle }) {
	return (
		<>
			<div className="flex max-w-xl flex-col text-center h-full">
				<h2 className="font-medium dark:text-white/70">{smallTitle}</h2>
				<h1 className="text-4xl font-medium tracking-tight">{bigTitle}</h1>
			</div>
			<Spacer y={4} />
			{children}
		</>
	);
}
