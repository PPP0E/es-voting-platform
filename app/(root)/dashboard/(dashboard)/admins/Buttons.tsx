"use client";

import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";
import { deleteAdmin } from "./actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSearchParams } from "@/lib/searchParams";
import { toast } from "sonner";
import { flushSync } from "react-dom";

export function DeleteButton({ id }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	async function deleteAdminHandler() {
		flushSync(() => {
			setIsLoading(true);
		});
		const res = await deleteAdmin(id);
		setIsLoading(false);
		if (!res?.ok) {
			toast.error(res?.message);
			return;
		}
		toast.success(res.message);
		router.refresh();
	}
	return <Button isIconOnly onPress={deleteAdminHandler} isDisabled={isLoading} endContent={<Icon className="" icon="solar:trash-bin-trash-outline" width={22} />} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto"></Button>;
}

export function EditButton({ id }) {
	const router = useRouter();
	function editAdminHandler() {
		updateSearchParams({ edit: id }, router);
	}

	return <Button onPress={editAdminHandler} isIconOnly endContent={<Icon className="" icon="solar:pen-new-square-outline" width={22} />} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto"></Button>;
}

export function EditPassword({ id }) {
	const router = useRouter();
	function editPasswordHandler() {
		updateSearchParams({ password: id }, router);
	}

	return <Button onPress={editPasswordHandler} isIconOnly endContent={<Icon className="" icon="solar:lock-password-linear" width={22} />} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto"></Button>;
}
