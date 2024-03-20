"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Textarea } from "@nextui-org/react";
import { editQuestion } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { flushSync } from "react-dom";

export default function Component({ question }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function editQuestionHandler(formData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", question?.id);
		const res = await editQuestion(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		toast.success("Question edited successfully");
		removeSearchParams({ edit: "" }, router);
		setIsLoading(false);
		router.refresh();
	}
	return (
		<Modal isOpen={searchParams.has("edit")} onOpenChange={() => removeSearchParams({ edit: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Edit Question</ModalHeader>
				<ModalBody id="main" as="form" action={editQuestionHandler}>
					<Input maxLength={100} isRequired defaultValue={question?.title} size="lg" label="Title" name="title" />
					<Textarea maxLength={500} defaultValue={question?.content} size="lg" label="Details" name="content" />
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
