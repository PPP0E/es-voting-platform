import Image from "next/image";
import TopFlowerPic from "@/public/assets/topflower.png";

import { auth } from "@/auth";

export async function TopFlower() {
	const session = await auth();
	if (!session) return;
	if (!session?.user?.student) return;
	const studentId = session?.user?.student?.id;
	if (!studentId) return;
	const onlyStudentIds = ["s181143", "s181143@englishschool.ac.cy", "-s171040"];
	if (!onlyStudentIds.includes(studentId)) return;
	return (
		<div className="absolute opacity-50 select-none">
			<Image src={TopFlowerPic} alt="Elay's Flowers" className="select-none" />
		</div>
	);
}

export default TopFlower;
