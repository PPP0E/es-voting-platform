import Image from "next/image";
import TopFlowerPic from "@/public/assets/topflower.png";
import BottomFlower from "@/public/assets/bottomflower.png";

import { auth } from "@/auth";

const onlyStudentIds = ["s181143", "s181143@englishschool.ac.cy", "181143", "-s171040"];

export async function TopFl() {
	const session = await auth();
	if (!session) return;
	if (!session?.user?.student) return;
	const studentId = session?.user?.student?.id;
	if (!studentId) return;
	if (!onlyStudentIds.includes(studentId)) return;
	return (
		<div className="absolute dark:opacity-55 opacity-75 select-none">
			<Image src={TopFlowerPic} alt="Fl" className="select-none" />
		</div>
	);
}

export async function BottomFl() {
	const session = await auth();
	if (!session) return;
	if (!session?.user?.student) return;
	const studentId = session?.user?.student?.id;
	if (!studentId) return;
	if (!onlyStudentIds.includes(studentId)) return;
	return (
		<div className=" dark:opacity-55 bottom-0 w-[200px] z-[-2] fixed opacity-75 select-none">
			<Image src={BottomFlower} alt="Fl" className="select-none" />
		</div>
	);
}

export default TopFl;
