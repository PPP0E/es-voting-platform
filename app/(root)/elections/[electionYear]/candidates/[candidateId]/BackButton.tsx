"use client";

import Icon from "@/components/ui/Icon";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function BackButton() {
	const router = useRouter();
	return (
		<Button isIconOnly onPress={() => router.back()} className="absolute bg-content1/60 border m-5 rounded-full">
			<Icon icon="solar:alt-arrow-left-outline" width={24} className="dark:text-white" />
		</Button>
	);
}
