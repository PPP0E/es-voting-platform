"use client";

import { useEffect, useState } from "react";

export function IncreasingStat({ value }) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (value === 0) return;

		let start = Date.now();
		const totalTime = 500; // Total animation time in ms

		const updateCount = () => {
			const elapsed = Date.now() - start;
			const progress = elapsed / totalTime;
			const currentCount = Math.min(Math.floor(value * progress), value);
			setCount(currentCount);

			if (currentCount < value) {
				requestAnimationFrame(updateCount);
			}
		};
		requestAnimationFrame(updateCount);
	}, [value]);

	return (
		<p className="bg-gradient-to-br ml-auto my-auto from-foreground-800 to-foreground-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:to-foreground-200">
			{count}
			{/* 			<span className="font-[300] text-sm"> views</span>
			 */}
		</p>
	);
}
