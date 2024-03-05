import prisma from "@/prisma/client";
import { DeleteButton, EditButton, EditPassword } from "./Buttons";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import EditPasswordModal from "./EditPasswordModal";
import { Link } from "@nextui-org/link";

export default async function Component({ searchParams }) {
	const admins = await prisma.admin.findMany({ orderBy: { fullName: "asc" } });
	let editAdmin = null;
	if (searchParams.edit) {
		editAdmin = await prisma.admin.findUnique({ where: { id: searchParams.edit } });
	}
	let passwordAdmin = null;
	if (searchParams.password) {
		passwordAdmin = await prisma.admin.findUnique({ where: { id: searchParams.password } });
	}

	return (
		<>
			<AddModal />
			<EditModal admin={editAdmin} />
			<EditPasswordModal admin={passwordAdmin} />
			<div>
				<ul className="w-full grid gap-4">
					{admins.map((admin, index) => (
						<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
							<div className="flex flex-col gap-1">
								<div className="flex gap-2">
									<p className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{admin.fullName}</p>
								</div>
								<h1 className="text-default-400 mt-1">{admin.email}</h1>
							</div>
							<div className="flex gap-2 ml-auto my-auto">
								<EditPassword id={admin.id} />
								<EditButton id={admin.id} />
								<DeleteButton id={admin.id} />
							</div>
						</li>
					))}
				</ul>
				{!admins.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border max-w-max mx-auto px-10 border-divider">
						<p>
							No Admins found but since you are viewing
							<br />
							this page you need to be an admin
							<br />
							hence there is a problem here.
							<br />
							Contact Berzan for help.
						</p>
						<Link href="/dashboard/faqs?add" className="mx-auto" showAnchorIcon>
							Add an Admin
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
