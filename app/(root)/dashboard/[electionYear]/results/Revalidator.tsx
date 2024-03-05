"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

//an invisible component to refrefh page every 5 seconds
export function Revalidator({ revalidate }) {
	const router = useRouter();
	useEffect(() => {
		const interval = setInterval(() => {
			router.refresh();
			console.log("refreshed");
		}, revalidate);
		return () => clearInterval(interval);
	});
	return <div></div>;
}

export default Revalidator;
