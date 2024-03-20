"use client";

import SwitchCell from "@/nextui/switch-cell";
import type { CardProps } from "@nextui-org/react";
import { Button, Card, CardBody, CardHeader, Chip, Input, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { automaticChange, currentChange, deleteAllVotes, forceChange, updateElectionDate, updateEndTime, updateStartTime, visibility } from "./actions";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { isVotingRunning } from "@/lib/isVotingRunning";
import { useDebouncedValue } from "@mantine/hooks";
import { toast } from "sonner";
import type { Election } from "@prisma/client";

export default function Component({ selectedElection }: { selectedElection: Election }) {
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [electionDate, setElectionDate] = useState(selectedElection.election_date || "");
	const [debouncedElectionDate] = useDebouncedValue(electionDate, 1000);
	const [electionStartTime, setElectionStartTime] = useState(selectedElection.voting_start_time || "");
	const [electionEndTime, setElectionEndTime] = useState(selectedElection.voting_end_time || "");
	const [debouncedElectionStartTime] = useDebouncedValue(electionStartTime, 1500);
	const [debouncedElectionEndTime] = useDebouncedValue(electionEndTime, 1500);
	const [password, setPassword] = useState("");

	const router = useRouter();

	async function handleCurrentChange() {
		setIsLoading(true);
		await currentChange(selectedElection.id, true);
		router.refresh();
		setIsLoading(false);
		setIsModalOpen(false);
	}

	async function handleAutomaticChange(e: Boolean) {
		setIsLoading(true);
		await automaticChange(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
	}

	async function handleForceChange(e: Boolean) {
		setIsLoading(true);
		await forceChange(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
	}

	async function handleVisibilityChange(e: Boolean) {
		setIsLoading(true);
		await visibility(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
	}

	/* 	inline-flex  border  w-full max-w-full items-center", "justify-between cursor-pointer rounded-xl gap-2 p-4"
	 */

	let months = [
		{ name: "January", days: 31 },
		{ name: "February", days: 28 },
		{ name: "March", days: 31 },
		{ name: "April", days: 30 },
		{ name: "May", days: 31 },
		{ name: "June", days: 30 },
		{ name: "July", days: 31 },
		{ name: "August", days: 31 },
		{ name: "September", days: 30 },
		{ name: "October", days: 31 },
		{ name: "November", days: 30 },
		{ name: "December", days: 31 },
	];

	const isLeapYear = (year: number) => {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	};

	if (isLeapYear(selectedElection.election_year)) {
		months[1].days = 29;
	}

	const isElectionRunning = isVotingRunning(selectedElection);

	async function setElectionDateHandler() {
		setIsLoading(true);
		const res = await updateElectionDate(selectedElection.id, debouncedElectionDate);
		console.log(res);
		if (res.ok) {
			toast.success("Election date updated");
		} else {
			toast.error("An error occurred while updating date.");
		}
		router.refresh();
		setIsLoading(false);
	}

	function handleStartTimeChange(value: string, type: "hour" | "minute") {
		if (type === "hour") {
			setElectionStartTime(`${value}:${electionStartTime.split(":")[1]}`);
			if (parseInt(electionEndTime.split(":")[0]) < parseInt(value)) {
				setElectionEndTime(`${value}:${electionEndTime.split(":")[1]}`);
			}
			if (parseInt(electionEndTime.split(":")[0]) === parseInt(value) && parseInt(electionEndTime.split(":")[1]) < parseInt(electionStartTime.split(":")[1])) {
				setElectionEndTime(`${value}:${electionStartTime.split(":")[1]}`);
			}
		} else {
			setElectionStartTime(`${electionStartTime.split(":")[0]}:${value}`);
			if (parseInt(electionEndTime.split(":")[0]) === parseInt(electionStartTime.split(":")[0]) && parseInt(electionEndTime.split(":")[1]) < parseInt(value)) {
				setElectionEndTime(`${electionEndTime.split(":")[0]}:${value}`);
			}
		}
	}

	function handleEndTimeChange(value: string, type: "hour" | "minute") {
		if (type === "hour") {
			if (parseInt(value) < parseInt(electionStartTime.split(":")[0])) {
				setElectionEndTime(electionStartTime);
				return;
			}
			setElectionEndTime(`${value}:${electionEndTime.split(":")[1]}`);
		} else {
			setElectionEndTime(`${electionEndTime.split(":")[0]}:${value}`);
		}
	}

	let startHours = Array.from({ length: 24 }, (_, i) => i);
	let startMinutes = Array.from({ length: 60 }, (_, i) => i);

	let endHours = Array.from({ length: 24 }, (_, i) => i);
	let endMinutes = Array.from({ length: 60 }, (_, i) => i);

	//remove end hours which are less than start hours
	endHours = endHours.filter((hour) => hour >= parseInt(electionStartTime.split(":")[0]));
	//if end hour and start hour same end minute should be greater than start minute
	if (parseInt(electionEndTime.split(":")[0]) === parseInt(electionStartTime.split(":")[0])) {
		endMinutes = endMinutes.filter((minute) => minute > parseInt(electionStartTime.split(":")[1]));
	}

	async function updateStartTimeHandler() {
		setIsLoading(true);
		const res = await updateStartTime(selectedElection.id, electionStartTime);
		if (res.ok) {
			toast.success("Start time updated");
		} else {
			toast.error("An error occurred while updating start time.");
		}
		router.refresh();
		setIsLoading(false);
	}

	async function updateEndTimeHandler() {
		setIsLoading(true);
		const res = await updateEndTime(selectedElection.id, electionEndTime);
		if (res.ok) {
			toast.success("End time updated");
		} else {
			toast.error("An error occurred while updating end time.");
		}
		router.refresh();
		setIsLoading(false);
	}

	async function deleteAllVotesHandler() {
		setIsLoading(true);
		const res = await deleteAllVotes(selectedElection.id, password);
		if (res.ok) {
			toast.success("All votes deleted");
			setIsDeleteModalOpen(false);
		} else {
			toast.error(res.message || "An error occurred while deleting votes.");
		}
		router.refresh();
		setIsLoading(false);
		setPassword("");
	}

	useEffect(() => {
		if (debouncedElectionDate !== selectedElection.election_date) {
			setElectionDateHandler();
		}
	}, [debouncedElectionDate]);

	useEffect(() => {
		if (debouncedElectionStartTime !== selectedElection.voting_start_time) {
			updateStartTimeHandler();
		}
	}, [debouncedElectionStartTime]);

	useEffect(() => {
		if (debouncedElectionEndTime !== selectedElection.voting_end_time) {
			updateEndTimeHandler();
		}
	}, [debouncedElectionEndTime]);

	function ChangeCurrentModal() {
		return (
			<Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Change Current Election</ModalHeader>
					<ModalBody>Are you sure you want to set the {selectedElection.election_year} election as current?</ModalBody>
					<ModalFooter>
						<Button onPress={() => setIsModalOpen(false)} color="danger" variant="light">
							Close
						</Button>
						<Button isDisabled={selectedElection.is_current} onPress={handleCurrentChange} color="primary">
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}

	const numberOfCandidates = selectedElection._count.Candidate;

	return (
		<>
			<Modal
				onClose={() => {
					setIsDeleteModalOpen(false);
					setPassword("");
				}}
				isOpen={isDeleteModalOpen}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Delete All Votes</ModalHeader>
					<ModalBody id="delete" as="form" action={deleteAllVotesHandler}>
						<p>Are you sure you want to delete all the votes of the {selectedElection.election_year} elections?</p>
						<Input value={password} onValueChange={setPassword} size="lg" label="Password" type="password" />
					</ModalBody>
					<ModalFooter>
						<Button
							onPress={() => {
								setIsDeleteModalOpen(false);
								setPassword("");
							}}
							color="danger"
							variant="light">
							Close
						</Button>
						<Button isDisabled={isElectionRunning || !password || password.length < 8} isLoading={isLoading} onPress={deleteAllVotesHandler} color="primary">
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<ChangeCurrentModal />
			<div className="w-full bg-transparent">
				<form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
					<div className="w-full flex-col gap-2  bg-content1/60 p-4 flex md:flex-col rounded-xl border">
						<div className="flex">
							<div className="flex flex-col gap-1">
								<div className="flex gap-2">
									<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200"> {isElectionRunning ? "Live Election" : "Not Running"}</p>
								</div>
								<p className="text-default-400 mt-1"></p>
							</div>
						</div>
					</div>
					<div className="w-full bg-content1/60 flex-row flex p-4 rounded-xl border">
						<div className="flex flex-col">
							<p className="text-medium">Current Election</p>
							<p className="text-small text-default-500">Set the election as current</p>
						</div>
						<Button onPress={() => setIsModalOpen(true)} isDisabled={isLoading || selectedElection.is_current} className="ml-auto my-auto" color="danger">
							{selectedElection.is_current ? "Current Election" : "Set as Current"}
						</Button>
					</div>
					<SwitchCell isDisabled={isLoading || selectedElection.is_current} onValueChange={handleVisibilityChange} defaultSelected={selectedElection.is_visible} label="Visible" description="Show the election on the public website" />
					<SwitchCell isDisabled={isLoading || !selectedElection.is_current} onValueChange={handleForceChange} defaultSelected={selectedElection.forceEnabled} label="Force Voting On" description="Let people vote even outside of the scheduled time" />
					<div className="w-full bg-content1/60 flex-col gap-4 md:flex-row flex p-4 rounded-xl border">
						<div className="flex flex-col my-auto">
							<p className="text-medium">Election Date</p>
							<p className="text-small text-default-500">The day the election will be held on</p>
						</div>
						<Input isRequired startContent="" value={electionDate} onChange={(e) => setElectionDate(e.target.value)} isDisabled={isLoading} label="Election Day" placeholder=" " className="md:max-w-[300px] my-auto ml-auto" type="date" min={`${selectedElection.election_year}-01-01`} max={`${selectedElection.election_year}-12-31`} />
					</div>
					<SwitchCell isDisabled={isLoading} onValueChange={handleAutomaticChange} defaultSelected={selectedElection.autoEnabled} description="Automatically start and end the voting based on the specified times." label="Automatic Scheduled Voting" />
					<div className="w-full bg-content1/60 flex-col gap-4 md:flex-row flex p-4 rounded-xl border">
						<div className="flex flex-col my-auto">
							<div className="flex gap-2">
								<p className="text-medium">Automatic Election Schedule</p>
								{selectedElection.autoEnabled ? (
									<Chip className="relative" color="success" size="sm">
										Active
									</Chip>
								) : (
									<Chip className="relative" color="danger" size="sm">
										Not Active
									</Chip>
								)}
							</div>
							<p className="text-small text-default-500">The "Automatic Scheduled Voting" setting.</p>
						</div>
						<div className="md:ml-auto my-auto flex">
							<Select label="Start Hour" selectedKeys={[electionStartTime.split(":")[0]]} onChange={(e) => handleStartTimeChange(e.target.value, "hour")} classNames={{ trigger: "rounded-r-none" }} className="md:w-[150px]">
								{startHours.map((hour) => {
									const formattedHour = hour.toString().padStart(2, "0");
									return (
										<SelectItem key={formattedHour} value={formattedHour}>
											{formattedHour}
										</SelectItem>
									);
								})}
							</Select>
							<Select label="Minute" defaultSelectedKeys={[electionStartTime.split(":")[1]]} onChange={(e) => handleStartTimeChange(e.target.value, "minute")} classNames={{ trigger: "rounded-l-none" }} className="md:w-[150px]">
								{startMinutes.map((minute) => {
									const formattedMinute = minute.toString().padStart(2, "0");
									return (
										<SelectItem key={formattedMinute} value={formattedMinute}>
											{formattedMinute}
										</SelectItem>
									);
								})}
							</Select>
						</div>
						<div className="my-auto flex">
							<Select label="End Hour" defaultSelectedKeys={[electionEndTime.split(":")[0]]} onChange={(e) => handleEndTimeChange(e.target.value, "hour")} classNames={{ trigger: "rounded-r-none" }} className="md:w-[150px] my-auto">
								{endHours.map((hour) => {
									const formattedHour = hour.toString().padStart(2, "0");
									return (
										<SelectItem key={formattedHour} value={formattedHour}>
											{formattedHour}
										</SelectItem>
									);
								})}
							</Select>
							<Select label="Minute" defaultSelectedKeys={[electionEndTime.split(":")[1]]} onChange={(e) => handleEndTimeChange(e.target.value, "minute")} classNames={{ trigger: "rounded-l-none" }} className="md:w-[150px] my-auto">
								{endMinutes.map((minute) => {
									const formattedMinute = minute.toString().padStart(2, "0");
									return (
										<SelectItem key={formattedMinute} value={formattedMinute}>
											{formattedMinute}
										</SelectItem>
									);
								})}
							</Select>
						</div>
					</div>
					<div className="w-full bg-content1/60 flex-col gap-4 md:flex-row flex p-4 rounded-xl border">
						<div className="flex flex-col my-auto">
							<p className="text-medium">Delete All Votes</p>
							<p className="text-small text-default-500">Deletes all votes from the election</p>
						</div>
						<Button isDisabled={isElectionRunning} onPress={() => setIsDeleteModalOpen(true)} className="ml-auto my-auto" color="danger">
							{isElectionRunning ? "Election Currently Running" : "Delete"}
						</Button>
					</div>
					<div className="w-full bg-red-800/60 flex-col gap-4 md:flex-row flex p-4 rounded-xl border-neutral-500 border">
						<div className="flex flex-col my-auto">
							<p className="text-medium">Delete Election</p>
							<p className="text-small text-default-500">Deletes the whole election, requires all candidates to be deleted.</p>
						</div>
						<Button color="primary" isDisabled={isElectionRunning || !!numberOfCandidates} onPress={() => setIsDeleteModalOpen(true)} className="ml-auto my-auto">
							{isElectionRunning || !!numberOfCandidates ? "Election Currently Can't Be Deleted" : "Delete"}
						</Button>
					</div>
				</form>
			</div>
		</>
	);
}

/* model Election {
   id                String      @id @unique @default(uuid())
   election_year     String      @unique
   is_current        Boolean     @default(false)
   forceEnabled      Boolean     @default(false)
   autoEnabled       Boolean     @default(true)
   blocked           Boolean     @default(false)
   total_voters      Int?
   description       String?
   voting_end_date   DateTime?
   publish_results   Boolean     @default(false)
   is_visible        Boolean     @default(false)
   Candidate         Candidate[]
} */
