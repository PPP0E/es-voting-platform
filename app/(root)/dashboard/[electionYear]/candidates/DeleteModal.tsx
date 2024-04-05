"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { useState } from "react";
import { deleteCandidate } from "./actions";
import { toast } from "sonner";
import { flushSync } from "react-dom";

export default function Component() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const id = searchParams.get("delete");

	async function deleteCandidateHandler() {
		flushSync(() => {
			setIsLoading(true);
		});
		const res = await deleteCandidate(id);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		removeSearchParams({ delete: "" }, router);
		router.refresh();
	}

	return (
		<Modal placement="center" isOpen={searchParams.has("delete") && searchParams.get("edit") !== ""} onOpenChange={() => removeSearchParams({ delete: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Delete Candidate</ModalHeader>
				<ModalBody>Are you sure you want to delete this candidate?</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ delete: "" }, router)}>
						Close
					</Button>
					<Button isLoading={isLoading} onPress={deleteCandidateHandler} color="primary">
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
