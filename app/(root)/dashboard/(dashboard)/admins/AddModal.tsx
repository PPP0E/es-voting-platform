"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeSearchParams } from "@/lib/searchParams";
import { Input, Textarea } from "@nextui-org/react";
import { useState, useTransition } from "react";
import { addAdmin } from "./actions";
import { toast } from "sonner";
import { flushSync } from "react-dom";

export default function Component() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function addAdminHandler(formData) {
		flushSync(() => {
			setIsLoading(true);
		});
		const res = await addAdmin(formData);
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
		<Modal placement="center" isOpen={searchParams.has("add")} onOpenChange={() => removeSearchParams({ add: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Add an Admin</ModalHeader>
				<ModalBody id="main" as="form" action={addAdminHandler}>
					<Input maxLength={50} isRequired size="lg" label="Full Name" name="fullName" />
					<Input maxLength={50} isRequired size="lg" label="Email" type="text" name="email" />
					<Input maxLength={50} isRequired minLength={8} size="lg" label="Password" name="password" />
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
