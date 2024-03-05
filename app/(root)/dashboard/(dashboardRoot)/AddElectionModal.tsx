"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Chip } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonGroup } from "@nextui-org/button";
import { removeSearchParams } from "@/lib/searchParams";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";

export function AddElectionModal() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [electionYear, setElectionYear] = useState("");
	const [electionMonth, setElectionMonth] = useState("");
	const [electionDay, setElectionDay] = useState("");
	const [startHour, setStartHour] = useState("");
	const [startMinute, setStartMinute] = useState("");
	const [endHour, setEndHour] = useState("");
	const [endMinute, setEndMinute] = useState("");

	function handleElectionYearChange(e) {
		const digits = /^[0-9\b]+$/;
		if (e.target.value === "" || digits.test(e.target.value)) {
			setElectionYear(e.target.value);
		}
	}

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

	const isLeapYear = (year) => {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	};

	if (isLeapYear(electionYear)) {
		months[1].days = 29;
	}

	async function handleAddElection(formData: FormData) {
		//formData object
		const formObject = Object.fromEntries(formData);
		console.log(formObject);
	}

	const hours = Array.from({ length: 24 }, (_, i) => i.toString()).map((hour) => (hour.length == 1 ? "0" + hour : hour));
	const minutes = Array.from({ length: 60 }, (_, i) => i.toString()).map((minute) => (minute.length == 1 ? "0" + minute : minute));

	//end time should be at least 1 minute after start time
	let startHours = hours;
	let startMinutes = minutes;
	let endHours = hours.filter((hour) => parseInt(hour) >= parseInt(startHour));
	let endMinutes = minutes;
	if (startHour === endHour) {
		endMinutes = minutes.filter((minute) => parseInt(minute) > parseInt(startMinute));
	}
	if (startHour === "23") {
		startMinutes = minutes.filter((minute) => minute != "59");
	}

	return (
		<Modal scrollBehavior="outside" isOpen={searchParams.has("add")} onOpenChange={() => removeSearchParams({ add: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Add New Election</ModalHeader>
				<ModalBody>
					<form action={handleAddElection} id="main" className="space-y-4">
						<Input onChange={handleElectionYearChange} value={electionYear} name="year" startContent="20" maxLength={2} minLength={2} size="lg" isRequired label="Election Year" />
						{electionYear.length == 2 && (
							<Select name="month" size="lg" onChange={(e) => setElectionMonth(e.target.value)} value={electionMonth} label="Election Month">
								{months.map((month, index) => (
									<SelectItem
										startContent={
											<Chip size="sm" className="min-w-8 text-center">
												{index + 1}
											</Chip>
										}
										key={index + 1}
										value={index + 1}>
										{month.name}
									</SelectItem>
								))}
							</Select>
						)}
						{electionYear.length == 2 && electionMonth && (
							<Select size="lg" name="year" value={electionDay} onChange={(e) => setElectionDay(e.target.value)} isRequired label="Election Day">
								{Array.from({ length: months[parseInt(electionMonth)].days }, (_, i) => (i + 1).toString()).map((day, index) => (
									<SelectItem key={index} value={day}>
										{day}
									</SelectItem>
								))}
							</Select>
						)}
						{electionYear.length == 2 && electionMonth && electionDay && (
							<div className="flex gap-4">
								{electionYear.length == 2 && electionMonth && electionDay && (
									<Select size="lg" name="startHour" onChange={(e) => setStartHour(e.target.value)} value={startHour} label="Start Hour">
										{startHours.map((hour) => (
											<SelectItem key={hour} value={hour}>
												{hour}
											</SelectItem>
										))}
									</Select>
								)}
								{electionYear.length == 2 && electionMonth && electionDay && startHour && (
									<Select size="lg" name="startMinute" onChange={(e) => setStartMinute(e.target.value)} value={startMinute} label="Start Minute">
										{startMinutes.map((minute) => (
											<SelectItem key={minute} value={minute}>
												{minute}
											</SelectItem>
										))}
									</Select>
								)}
							</div>
						)}
						{electionYear.length == 2 && electionMonth && electionDay && startHour && startMinute && (
							<div className="flex gap-4">
								{electionYear.length == 2 && electionMonth && electionDay && (
									<Select size="lg" name="endHour" onChange={(e) => setEndHour(e.target.value)} value={endHour} label="End Hour">
										{endHours.map((hour) => (
											<SelectItem key={hour} value={hour}>
												{hour}
											</SelectItem>
										))}
									</Select>
								)}
								{electionYear.length == 2 && electionMonth && electionDay && startHour && endHour && (
									<Select size="lg" name="endMinute" onChange={(e) => setEndMinute(e.target.value)} value={endMinute} label="End Minute">
										{endMinutes.map((minute) => (
											<SelectItem key={minute} value={minute}>
												{minute}
											</SelectItem>
										))}
									</Select>
								)}
							</div>
						)}
						<Textarea name="description" size="lg" label="Description" />
					</form>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="light" onPress={() => removeSearchParams({ add: "" }, router)}>
						Close
					</Button>
					<Button type="submit" form="main" color="primary">
						Add Election
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default AddElectionModal;
