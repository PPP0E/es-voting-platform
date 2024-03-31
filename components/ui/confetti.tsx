"use client";

import useWindowDimensions from "@/lib/useWindowDimension";
import ReactConfetti from "react-confetti";

export default function Confetti() {
	const { width, height } = useWindowDimensions();
	if (width && height) {
		return <ReactConfetti className={`!max-w-[${width}px]`} numberOfPieces={90} width={width} height={height} />;
	}
	return;
}
