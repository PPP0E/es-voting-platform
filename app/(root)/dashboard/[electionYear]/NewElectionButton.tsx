"use client";

import { Button } from "@nextui-org/button";
import Icon from "@/components/ui/Icon";
import { updateSearchParams } from "@/lib/searchParams";
import { usePathname, useRouter } from "next/navigation";

export default function Component() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<Button onPress={() => updateSearchParams({ add: "" }, router)} className="bg-foreground text-background" startContent={<Icon className="flex-none text-background/60" icon="lucide:plus" width={16} />}>
			Add New
		</Button>
	);
}
