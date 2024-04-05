"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Textarea } from "@nextui-org/react";
import { editFaq } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { flushSync } from "react-dom";

export default function Component({ faq }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function editFaqHandler(formData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", faq?.id);
		const res = await editFaq(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		toast.success("Faq edited successfully");
		removeSearchParams({ edit: "" }, router);
		setIsLoading(false);
		router.refresh();
	}
	return (
		<Modal placement="center" isOpen={searchParams.has("edit")} onOpenChange={() => removeSearchParams({ edit: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Edit Faq</ModalHeader>
				<ModalBody id="main" as="form" action={editFaqHandler}>
					<Input maxLength={100} isRequired defaultValue={faq?.title} size="lg" label="Title" name="title" />
					<Textarea maxLength={500} isRequired defaultValue={faq?.content} size="lg" label="Content" name="content" />
				</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ edit: "" }, router)}>
						Close
					</Button>
					<Button isLoading={isLoading} color="primary" type="submit" form="main">
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
