"use client";

import SwitchCell, { SwitchCellBottom, SwitchCellMiddle, SwitchCellTop } from "@/nextui/switch-cell";
import type { CardProps } from "@nextui-org/react";
import { Button, Card, CardBody, CardHeader, Chip, Input, Link, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { allowEditBio, allowEditPhoto, allowEditQuestions, allowEditSlogan, allowEditSocials, automaticChange, currentChange, deleteAllVotes, deleteElection, forceChange, updateElectionDate, updateEndTime, updateStartTime, visibility } from "./actions";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { isVotingRunning } from "@/lib/isVotingRunning";
import { useDebouncedValue } from "@mantine/hooks";
import { toast } from "sonner";
import type { Election } from "@prisma/client";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";

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

export default function Component({ selectedElection }: { selectedElection: Election }) {
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleteElectionModalOpen, setIsDeleteElectionModalOpen] = useState(false);
	const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
	const [electionDate, setElectionDate] = useState(selectedElection.election_date || "");
	const [debouncedElectionDate] = useDebouncedValue(electionDate, 1000);
	const [electionStartTime, setElectionStartTime] = useState(selectedElection.voting_start_time || "");
	const [electionEndTime, setElectionEndTime] = useState(selectedElection.voting_end_time || "");
	const [debouncedElectionStartTime] = useDebouncedValue(electionStartTime, 1500);
	const [debouncedElectionEndTime] = useDebouncedValue(electionEndTime, 1500);
	const [password, setPassword] = useState("");

	const router = useRouter();

	const numberOfCandidates = selectedElection._count.Candidate;
	const isElectionRunning = isVotingRunning(selectedElection);

	const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	if (isLeapYear(Number(selectedElection.election_year))) months[1].days = 29;

	let startHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
	let startMinutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

	let endHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
	let endMinutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

	endHours = endHours.filter((hour) => parseInt(hour) >= parseInt(electionStartTime.split(":")[0]));

	if (parseInt(electionEndTime.split(":")[0]) === parseInt(electionStartTime.split(":")[0])) {
		endMinutes = endMinutes.filter((minute) => parseInt(minute) > parseInt(electionStartTime.split(":")[1]));
	}

	async function handleAllowBioChange(e: Boolean) {
		setIsLoading(true);
		const res = await allowEditBio(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
		if (res?.ok) {
			toast.success(res?.message);
		} else {
			toast.error(res?.message);
		}
	}

	async function handleAllowEditSloganChange(e: Boolean) {
		setIsLoading(true);
		const res = await allowEditSlogan(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
		if (res?.ok) {
			toast.success(res?.message);
		} else {
			toast.error(res?.message);
		}
	}

	async function handleAllowEditSocialsChange(e: Boolean) {
		setIsLoading(true);
		const res = await allowEditSocials(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
		if (res?.ok) {
			toast.success(res?.message);
		} else {
			toast.error(res?.message);
		}
	}

	async function handleAllowEditPhotoChange(e: Boolean) {
		setIsLoading(true);
		const res = await allowEditPhoto(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
		if (res?.ok) {
			toast.success(res?.message);
		} else {
			toast.error(res?.message);
		}
	}

	async function handleAllowEditQuestionsChange(e: Boolean) {
		setIsLoading(true);
		const res = await allowEditQuestions(selectedElection.id, e);
		router.refresh();
		setIsLoading(false);
		if (res?.ok) {
			toast.success(res?.message);
		} else {
			toast.error(res?.message);
		}
	}

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

	async function setElectionDateHandler() {
		setIsLoading(true);
		const res = await updateElectionDate(selectedElection.id, debouncedElectionDate);
		if (res.ok) {
			toast.success("Election date updated");
		} else {
			toast.error("An error occurred while updating date.");
		}
		router.refresh();
		setIsLoading(false);
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

	async function deleteElectionHandler() {
		setIsLoading(true);
		const res = await deleteElection(selectedElection.id, password);
		if (res.ok) {
			toast.success("Election deleted");
			setIsDeleteElectionModalOpen(false);
		} else {
			toast.error(res.message || "An error occurred while deleting election.");
		}
		router.refresh();
		setIsLoading(false);
		setPassword("");
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

	function ButtonCard({ title, description, children, className = "" }) {
		return (
			<div className={cn("w-full bg-content1/60 flex-col gap-4 md:flex-row flex p-4 rounded-xl border", className)}>
				<div className="flex flex-col my-auto">
					<p className="text-medium">{title}</p>
					<p className="text-small text-default-500">{description}</p>
				</div>
				{children}
			</div>
		);
	}

	function SectionTitle({ children, href = "" }) {
		return (
			<Link showAnchorIcon={href !== ""} href={href} className="px-4 py-2">
				{children}
			</Link>
		);
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

	function PublishResultsModal() {
		return (
			<Modal disableAnimation key="PublishResultsModal" onClose={() => setIsPublishModalOpen(false)} isOpen={isPublishModalOpen}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Publish Results</ModalHeader>
					<ModalBody>
						<p>Are you sure you want to publish the results of the {selectedElection.election_year} elections?</p>
						<Input autoFocus key="PublishResultsModalInput" value={password} onValueChange={setPassword} size="lg" label="Password" type="password" />
					</ModalBody>
					<ModalFooter>
						<Button onPress={() => setIsPublishModalOpen(false)} color="danger" variant="light">
							Close
						</Button>
						<Button isDisabled={selectedElection.publish_results} onPress={handleCurrentChange} color="primary">
							Publish
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}

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
					<ModalBody id="deleteVotes" as="form" action={deleteAllVotesHandler}>
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
						<Button isDisabled={isElectionRunning || !password || password.length < 8} type="submit" isLoading={isLoading} form="deleteVotes" color="primary">
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal
				onClose={() => {
					setIsDeleteElectionModalOpen(false);
					setPassword("");
				}}
				isOpen={isDeleteModalOpen}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Delete the Election</ModalHeader>
					<ModalBody as="form" id="deleteElection" action={deleteAllVotesHandler}>
						<p>Are you sure you want to delete the {selectedElection.election_year} election?</p>
						<Input value={password} onValueChange={setPassword} size="lg" label="Password" type="password" />
					</ModalBody>
					<ModalFooter>
						<Button
							onPress={() => {
								setIsDeleteElectionModalOpen(false);
								setPassword("");
							}}
							color="danger"
							variant="light">
							Close
						</Button>
						<Button isDisabled={isElectionRunning || !password || password.length < 8} type="submit" isLoading={isLoading} form="deleteElection" color="primary">
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">Change Current Election</ModalHeader>
					<ModalBody>
						<p>Are you sure you want to set the {selectedElection.election_year} election as current?</p>
						<Input value={password} onValueChange={setPassword} size="lg" label="Password" type="password" />
					</ModalBody>
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
			<PublishResultsModal />
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
					<div>
						<SectionTitle>Main Settings</SectionTitle>
						<div className="gap-4 auto-rows-fr grid md:grid-cols-2">
							<ButtonCard title="Election Date">
								<Input isRequired value={electionDate} onChange={(e) => setElectionDate(e.target.value)} placeholder=" " label="Day and Month" isDisabled={isLoading} className="md:max-w-[300px] my-auto ml-auto" type="date" min={`${selectedElection.election_year}-01-01`} max={`${selectedElection.election_year}-12-31`} />
							</ButtonCard>
							<ButtonCard title="Current Election" description="Set the election as current">
								<Button onPress={() => setIsModalOpen(true)} isDisabled={isLoading || selectedElection.is_current} className="ml-auto my-auto md:w-auto w-full rounded-full" color="danger">
									{selectedElection.is_current ? "Current Election" : "Set as Current"}
								</Button>
							</ButtonCard>
							<SwitchCell isDisabled={isLoading || selectedElection.is_current} onValueChange={handleVisibilityChange} defaultSelected={selectedElection.is_visible} label="Visible" description="Show the election on the public website" />
							<SwitchCell isDisabled={isLoading || !selectedElection.is_current} onValueChange={handleForceChange} defaultSelected={selectedElection.forceEnabled} label="Force Voting On" />
							<ButtonCard title="Publish Results" description="Stop the election and publish the results publicly on the website. How many votes each candidates got won't be shown.">
								<Button onPress={() => setIsPublishModalOpen(true)} isDisabled={isLoading || selectedElection.publish_results} className="ml-auto my-auto md:w-auto w-full min-w-max rounded-full" color="success">
									{selectedElection.publish_results ? "Results Published" : "Publish Results"}
								</Button>
							</ButtonCard>
						</div>
					</div>
					<div className="flex flex-col">
						<SectionTitle>Scheduled Election Settings</SectionTitle>
						<SwitchCellTop isDisabled={isLoading} onValueChange={handleAutomaticChange} defaultSelected={selectedElection.autoEnabled} description="Automatically start and end the voting based on the specified times." label="Automatic Scheduled Voting" />
						<ButtonCard title="Automatic Election Schedule" description="The day the election will be held on" className="rounded-t-none border-t-0">
							<div className="md:ml-auto my-auto flex">
								<Select label="Start Hour" selectedKeys={[electionStartTime.split(":")[0]]} onChange={(e) => handleStartTimeChange(e.target.value, "hour")} classNames={{ trigger: "rounded-r-none" }} className="md:w-[150px]">
									{startHours.map((hour) => {
										return <SelectItem key={hour}>{hour}</SelectItem>;
									})}
								</Select>
								<Select label="Minute" defaultSelectedKeys={[electionStartTime.split(":")[1]]} onChange={(e) => handleStartTimeChange(e.target.value, "minute")} classNames={{ trigger: "rounded-l-none" }} className="md:w-[150px]">
									{startMinutes.map((minute) => {
										return <SelectItem key={minute}>{minute}</SelectItem>;
									})}
								</Select>
							</div>
							<div className="my-auto flex">
								<Select label="End Hour" defaultSelectedKeys={[electionEndTime.split(":")[0]]} onChange={(e) => handleEndTimeChange(e.target.value, "hour")} classNames={{ trigger: "rounded-r-none" }} className="md:w-[150px] my-auto">
									{endHours.map((hour) => {
										return <SelectItem key={hour}>{hour}</SelectItem>;
									})}
								</Select>
								<Select label="Minute" defaultSelectedKeys={[electionEndTime.split(":")[1]]} onChange={(e) => handleEndTimeChange(e.target.value, "minute")} classNames={{ trigger: "rounded-l-none" }} className="md:w-[150px] my-auto">
									{endMinutes.map((minute) => (
										<SelectItem key={minute}>{minute}</SelectItem>
									))}
								</Select>
							</div>
						</ButtonCard>
					</div>
					<div className="flex flex-col">
						<SectionTitle>Candidate Permissions</SectionTitle>
						<SwitchCellTop isDisabled={isLoading} onValueChange={handleAllowBioChange} defaultSelected={selectedElection.edit_bio} description="Allow candidates to edit their biographies" label="Allow Biography Editing" />
						<SwitchCellMiddle isDisabled={isLoading} onValueChange={handleAllowEditSloganChange} defaultSelected={selectedElection.edit_slogan} description="Allow candidates to edit their slogans" label="Allow Slogan Editing" />
						<SwitchCellMiddle isDisabled={isLoading} onValueChange={handleAllowEditSocialsChange} defaultSelected={selectedElection.edit_socials} description="Allow candidates to edit their socials" label="Allow Social Media Editing" />
						<SwitchCellMiddle isDisabled={isLoading} onValueChange={handleAllowEditPhotoChange} defaultSelected={selectedElection.edit_photo} description="Allow candidates to edit their photos" label="Allow Photo Editing" />
						<SwitchCellBottom isDisabled={isLoading} onValueChange={handleAllowEditQuestionsChange} defaultSelected={selectedElection.edit_questions} description="Allow candidates to edit their questions" label="Allow Question Editing" />
					</div>
					<div>
						<SectionTitle>Danger Zone</SectionTitle>
						<ButtonCard title="Delete All Votes" description="Deletes all votes from the election" className="rounded-b-none bg-red-800/60 border-neutral-500">
							<Button color="primary" isDisabled={isElectionRunning} onPress={() => setIsDeleteModalOpen(true)} className="ml-auto my-auto ">
								{isElectionRunning ? "Election Currently Running" : "Delete"}
							</Button>
						</ButtonCard>
						<ButtonCard title="Delete Election" description="Deletes the whole election, requires all candidates to be deleted." className="rounded-t-none border-t-0 bg-red-800/60 border-neutral-500">
							<Button color="primary" isDisabled={isElectionRunning || !!numberOfCandidates || selectedElection.autoEnabled} onPress={() => setIsDeleteModalOpen(true)} className="ml-auto my-auto">
								{isElectionRunning || !!numberOfCandidates || selectedElection.autoEnabled ? "Election Currently Can't Be Deleted" : "Delete"}
							</Button>
						</ButtonCard>
					</div>
				</form>
			</div>
		</>
	);
}

/* model Election {
   id                 String      @id @unique @default(uuid())
   election_date      String?
   election_year      String      @unique
   is_current         Boolean     @default(false)
   forceEnabled       Boolean     @default(false)
   autoEnabled        Boolean     @default(false)
   blocked            Boolean     @default(false)
   total_voters       Int?
   description        String?
   voting_start_time  String?
   voting_end_time    String?
   publish_results    Boolean     @default(false)
   is_visible         Boolean     @default(false)
   //
   edit_bio           Boolean     @default(true)
   edit_slogan        Boolean     @default(true)
   edit_socials       Boolean     @default(true) //includes social media and video; speech is added by admin
   edit_photo         Boolean     @default(true)
   edit_questions     Boolean     @default(true)
   //
   candidates_visible Boolean     @default(false)
   //
   Candidate          Candidate[]
   Question           Question[]
} */
