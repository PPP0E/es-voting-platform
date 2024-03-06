"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useState, useTransition } from "react";
import { addCandidate } from "./actions";
import { toast } from "sonner";
import { flushSync } from "react-dom";
import { nameCase } from "@/lib/nameCase";

export default function Component({ selectedElectionYear }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [studentId, setStudentId] = useState("");

	async function addcandidateHandler(formData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("electionYear", selectedElectionYear);
		const res = await addCandidate(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		removeSearchParams({ add: "" }, router);
		router.refresh();
	}

	useEffect(() => {
		setFirstName("");
		setLastName("");
		setStudentId("");
	}, [searchParams.has("add")]);

	return (
		<Modal isOpen={searchParams.has("add")} onOpenChange={() => removeSearchParams({ add: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Add Candidate</ModalHeader>
				<ModalBody id="main" as="form" action={addcandidateHandler}>
					<Input onBlur={() => setFirstName(firstName.trim())} value={firstName} onChange={(e) => setFirstName(nameCase(e.target.value))} maxLength={50} isRequired size="lg" name="officialName" label="First Name" />
					<Input onBlur={() => setLastName(lastName.trim())} value={lastName} onChange={(e) => setLastName(nameCase(e.target.value))} maxLength={50} isRequired size="lg" name="officialSurname" label="Last Name" />
					<Input isInvalid={!studentId.match(/^\d{2}[1-7]\d{3}$/)} value={studentId} onValueChange={setStudentId} startContent="s" maxLength={6} isRequired size="lg" name="student_id" label="Student ID" />
					<Select size="lg" name="type" label="Candidate Type" isRequired>
						<SelectItem key="GIRL" value="GIRL">
							Head Girl
						</SelectItem>
						<SelectItem key="BOY" value="BOY">
							Head Boy
						</SelectItem>
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ add: "" }, router)}>
						Close
					</Button>
					<Button isLoading={isLoading} color="primary" type="submit" form="main">
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
