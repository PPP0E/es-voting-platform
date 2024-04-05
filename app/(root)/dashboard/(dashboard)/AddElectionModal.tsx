"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Chip } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonGroup } from "@nextui-org/button";
import { removeSearchParams } from "@/lib/searchParams";
import { useState } from "react";
import { addElection } from "./actions";
import { toast } from "sonner";

export function AddElectionModal() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [electionYear, setElectionYear] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	function handleElectionYearChange(e) {
		const digits = /^[0-9\b]+$/;
		if (e.target.value === "" || digits.test(e.target.value)) {
			setElectionYear(e.target.value);
		}
	}

	async function handleAddElection(formData: FormData) {
		setIsLoading(true);
		//formData object
		const res = await addElection(formData);
		if (res?.ok) {
			removeSearchParams({ add: "" }, router);
			toast.success("Election added successfully");
		} else {
			toast.error(res?.message);
		}
		setIsLoading(false);
		router.refresh();
	}

	//end time should be at least 1 minute after start time
	return (
		<Modal placement="center" scrollBehavior="outside" isOpen={searchParams.has("add")} onOpenChange={() => removeSearchParams({ add: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Add New Election</ModalHeader>
				<ModalBody>
					<form action={handleAddElection} id="main" className="space-y-4">
						<Input onChange={handleElectionYearChange} value={electionYear} name="election_year" startContent="20" maxLength={2} minLength={2} size="lg" isRequired label="Election Year" />
					</form>
				</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ add: "" }, router)}>
						Close
					</Button>
					<Button isLoading={isLoading} type="submit" form="main" color="primary">
						Add Election
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default AddElectionModal;
