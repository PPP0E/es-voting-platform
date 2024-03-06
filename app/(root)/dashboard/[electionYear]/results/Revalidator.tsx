"use client";

import Icon from "@/components/ui/Icon";
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//an invisible component to refrefh page every 5 seconds
export function Revalidator({ revalidate = 10000 }) {
	const router = useRouter();
	const [isProgressive, setIsProgressive] = useState(true);
	useEffect(() => {
		const interval = setInterval(() => {
			if (!isProgressive) return;
			router.refresh();
			console.log("refreshed");
		}, revalidate);
		return () => clearInterval(interval);
	});
	return (
		<>
			<Button startContent={isProgressive ? <Icon icon="fluent-mdl2:update-restore" width={14} /> : <Icon icon="fluent-mdl2:disable-updates" width={14} />} onPress={() => setIsProgressive(!isProgressive)} fullWidth className={`border-small border-black/10 bg-black/10 shadow-md light:text-black dark:border-white/20 dark:bg-white/10 md:w-auto md:rounded-full ${isProgressive ? "!bg-green-500/30" : "!bg-red-500/30"}`}>
				Live Results<strong>{isProgressive ? "On" : "Off"}</strong>
			</Button>
			<Spacer y={6} />
		</>
	);
}

export default Revalidator;
