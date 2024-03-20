"use client";

import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";
import { moveDown, moveUp, deleteQuestion } from "./actions";
import { startTransition, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSearchParams } from "@/lib/searchParams";
import { toast } from "sonner";
import { flushSync } from "react-dom";

export function MoveUpButton({ index, length, id, electionYear }) {
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	async function moveUpHandler() {
		startTransition(async () => {
			await moveUp(id, electionYear);
			router.refresh();
		});
	}
	return (
		<Button onPress={moveUpHandler} isDisabled={index == 0 || pending} isIconOnly fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto">
			<Icon className="" icon="solar:arrow-up-outline" width={20} />
		</Button>
	);
}

export function MoveDownButton({ index, length, id, electionYear }) {
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	async function moveDownHandler() {
		startTransition(async () => {
			await moveDown(id, electionYear);
			router.refresh();
		});
	}
	return (
		<Button onPress={moveDownHandler} isDisabled={index + 1 == length || pending} isIconOnly fullWidth className={`border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto ${index !== 0 && "border-l-0"}`}>
			<Icon className="" icon="solar:arrow-down-outline" width={20} />
		</Button>
	);
}

export function DeleteButton({ id }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	async function deleteQuestionHandler() {
		flushSync(() => {
			setIsLoading(true);
		});
		const res = await deleteQuestion(id);
		setIsLoading(false);
		if (!res?.ok) {
			toast.error(res?.message);
			return;
		}
		toast.success(res.message);
		router.refresh();
	}
	return <Button isIconOnly onPress={deleteQuestionHandler} isDisabled={isLoading} endContent={<Icon className="" icon="solar:trash-bin-trash-outline" width={22} />} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto"></Button>;
}

export function EditButton({ id }) {
	const router = useRouter();
	function editQuestionHandler() {
		updateSearchParams({ edit: id }, router);
	}

	return <Button onPress={editQuestionHandler} isIconOnly endContent={<Icon className="" icon="solar:pen-new-square-outline" width={22} />} fullWidth className="border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 w-auto"></Button>;
}
