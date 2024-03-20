"use client";

import useWindowDimensions from "@/lib/useWindowDimension";
import ReactConfetti from "react-confetti";

export default function Confetti() {
	const { width, height } = useWindowDimensions();
	if (width && height) {
		return <ReactConfetti numberOfPieces={150} width={width} height={height} />;
	}
	return;
}
