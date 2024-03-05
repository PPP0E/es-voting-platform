"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Textarea } from "@nextui-org/react";
import { useState, useTransition } from "react";
import { addFaq } from "./actions";
import { toast } from "sonner";
import { flushSync } from "react-dom";

export default function Component() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function addFaqHandler(formData) {
		flushSync(() => {
			setIsLoading(true);
		});
		const res = await addFaq(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		removeSearchParams({ add: "" }, router);
		router.refresh();
	}

	return (
		<Modal isOpen={searchParams.has("add")} onOpenChange={() => removeSearchParams({ add: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Add FAQ</ModalHeader>
				<ModalBody id="main" as="form" action={addFaqHandler}>
					<Input maxLength={100} isRequired size="lg" label="Title" name="title" />
					<Textarea maxLength={500} isRequired size="lg" label="Content" name="content" />
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
