"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Textarea } from "@nextui-org/react";
import { editPassword } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import { flushSync } from "react-dom";

export default function Component({ admin }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function editAdminHandler(formData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("id", admin?.id);
		const res = await editPassword(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		toast.success("Admin edited successfully");
		removeSearchParams({ password: "" }, router);
		setIsLoading(false);
		router.refresh();
	}
	return (
		<Modal placement="center" isOpen={searchParams.has("password")} onOpenChange={() => removeSearchParams({ password: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Set New Password</ModalHeader>
				<ModalBody id="main" as="form" action={editAdminHandler}>
					<Input maxLength={50} minLength={8} isRequired size="lg" type="password" label="Password" name="password" />
				</ModalBody>
				<ModalFooter>
					<Button isLoading={isLoading} color="danger" variant="light" onPress={() => removeSearchParams({ password: "" }, router)}>
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
