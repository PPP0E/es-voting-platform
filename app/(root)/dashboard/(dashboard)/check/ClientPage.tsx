"use client";
import { removeSearchParams, updateSearchParams } from "@/lib/searchParams";
import { Button, Chip, Divider } from "@nextui-org/react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteBallot } from "./actions";
import { toast } from "sonner";
import { isVotingRunning } from "@/lib/isVotingRunning";

export default function ClientComponent({ votes = [] }) {
	const countDown = 2;
	const [viewableVotes, setViewableVotes] = useState(votes);
	const router = useRouter();
	const [showCandidate, setShowCandidate] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [seconds, setSeconds] = useState(0);

	async function deleteBallotHandler(id) {
		setIsLoading(true);
		const res = await deleteBallot(id);
		if (res?.ok) {
			toast.success(res.message);
			router.refresh();
		}
		if (!res?.ok) {
			toast.error(res.message);
		}
		setIsLoading(false);
	}

	useEffect(() => {
		let interval = null;
		// When viewBallotIds is true, start the countdown
		if (showCandidate) {
			interval = setInterval(() => {
				setSeconds((seconds) => seconds - 1);
			}, 1000);
		}
		// When viewBallotIds is false or seconds reach 0, reset everything
		if (!showCandidate || seconds === 0) {
			clearInterval(interval);
			setShowCandidate(false);
			setSeconds(countDown); // Reset seconds for the next time viewBallotIds is set to true
		}
		// Cleanup function to clear the interval
		return () => clearInterval(interval);
	}, [showCandidate, seconds]);

	function handleReset() {
		removeSearchParams({ votes: "" }, router);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-2xl overflow-hidden">
				<Scanner
					onResult={(text) => {
						setShowCandidate(false);
						updateSearchParams({ votes: text.split("#").join("+") }, router);
					}}
					onError={() => {}}
				/>
			</div>
			<Button className="bg-content1/60 border" color="danger" isDisabled={!votes.length} onPress={handleReset}>
				Reset
			</Button>
			{votes.map((v) => {
				const isElectionRunning = isVotingRunning(v.Candidate.election);
				return (
					<div className="w-full bg-content1/60 p-4 border select-none rounded-xl">
						<div className="flex">
							<p className="font-bold">Election Ballot</p>
						</div>
						<Divider className="mb-2 mt-2 bg-white/30" />
						<div className="flex">
							<p className="font-bold">Student ID</p>
							<p className="ml-auto" onClick={() => setShowCandidate(!showCandidate)}>
								{v.student_id}
							</p>
						</div>
						{showCandidate && (
							<div className="flex">
								<p className="font-bold">Hiding in {seconds}s</p>
								<p className="ml-auto">
									{v?.Candidate?.officialName} {v?.Candidate?.officialSurname}
								</p>
							</div>
						)}
						<div className="flex">
							<p className="font-bold">Election Year</p>
							<p className="ml-auto"> {v.Candidate.election.election_year}</p>
						</div>
						<div className="flex">
							<p className="font-bold">Time Voted</p> <p className="ml-auto">{v.time.toLocaleString("en-GB", { hour12: false })}</p>
						</div>
						<div className="flex">
							<p className="font-bold">Ballot ID Node</p> <p className="ml-auto">{v.id.split("-")[4]}</p>
						</div>
						<Button isLoading={isLoading} isDisabled={!isElectionRunning} onPress={() => deleteBallotHandler(v.id)} className="w-full mt-2 border bg-contrent1/20">
							Delete
						</Button>
					</div>
				);
			})}
		</div>
	);
}
