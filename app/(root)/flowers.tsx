import Image from "next/image";
import TopFlowerPic from "@/public/assets/topflower.png";

import { auth } from "@/auth";

export async function TopFlower() {
	const session = await auth();
	if (!session) return null;
	if (!session.user?.student) return null;
	const studentId = session.user.student.studentId;
	if (!studentId) return null;
	const onlyStudentId = ["s181143"];
	if (!onlyStudentId.includes(studentId)) return null;
	return (
		<div className="absolute opacity-50 select-none">
			<Image src={TopFlowerPic} alt="Flowers" className="select-none" />
		</div>
	);
}
