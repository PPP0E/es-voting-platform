import Icon from "@/components/ui/Icon";
import prisma from "@/prisma/client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { DeleteButton, EditButton, MoveDownButton, MoveUpButton } from "./Buttons";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";

export default async function Component({ searchParams }) {
	const faqs = await prisma.faq.findMany({ orderBy: { index: "asc" } });
	let editFaq = null;
	if (searchParams.edit) {
		editFaq = await prisma.faq.findUnique({ where: { id: searchParams.edit } });
	}

	return (
		<>
			<AddModal />
			<EditModal faq={editFaq} />
			<div>
				<ul className="w-full grid gap-4">
					{faqs.map((faq, index) => (
						<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
							<div className="flex flex-col gap-1">
								<div className="flex gap-2 flex-col md:flex-row">
									<Chip color="primary" className="rounded-lg">
										{faq.index + 1}
									</Chip>
									<h2 className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent mb-[-10px] dark:to-foreground-200">{faq.title}</h2>
								</div>
								<p className="text-default-400 mt-1">{faq.content}</p>
							</div>
							<div className="flex gap-2 ml-auto my-auto">
								<EditButton id={faq.id} />
								<DeleteButton id={faq.id} />
								<ButtonGroup>
									<MoveUpButton id={faq.id} index={index} length={faqs.length} />
									<MoveDownButton id={faq.id} index={index} length={faqs.length} />
								</ButtonGroup>
							</div>
						</li>
					))}
				</ul>
				{!faqs.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border max-w-max mx-auto px-10 border-divider">
						<p>No FAQs found</p>
						<Link href="/dashboard/faqs?add" className="mx-auto" showAnchorIcon>
							Add a FAQ
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
