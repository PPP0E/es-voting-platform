import Icon from "@/components/ui/Icon";
import prisma from "@/prisma/client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { DeleteButton, EditButton, MoveDownButton, MoveUpButton } from "./Buttons";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";

export default async function Component({ searchParams, params }) {
	const questions = await prisma.question.findMany({ where: { election: { election_year: params.electionYear } }, orderBy: { index: "asc" } });
	let editQuestion = null;
	if (searchParams.edit) {
		editQuestion = await prisma.question.findUnique({ where: { id: searchParams.edit } });
	}
	return (
		<>
			<AddModal selectedElectionYear={params.electionYear} />
			<EditModal question={editQuestion} />
			<div>
				<ul className="w-full grid gap-4">
					{questions.map((question, index) => (
						<li key={index} className="w-full flex-col gap-2 bg-content1/60 p-4 flex md:flex-row rounded-xl border">
							<div className={`flex gap-1 ${question.content ? "flex-col" : "flex-row"}`}>
								<div className="flex gap-2 h-full flex-col md:flex-row">
									<Chip color="primary" className="rounded-lg my-auto">
										{question.index + 1}
									</Chip>
									<p className="bg-gradient-to-br from-foreground-800 my-auto to-foreground-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent dark:to-foreground-200">{question.title}</p>
								</div>
								<h1 className="text-default-400 mt-1">{question.content}</h1>
							</div>
							<div className="flex gap-2 ml-auto my-auto">
								<EditButton id={question.id} />
								<DeleteButton id={question.id} />
								<ButtonGroup>
									<MoveUpButton electionYear={params.electionYear} id={question.id} index={index} length={questions.length} />
									<MoveDownButton electionYear={params.electionYear} id={question.id} index={index} length={questions.length} />
								</ButtonGroup>
							</div>
						</li>
					))}
				</ul>
				{!questions.length && (
					<div className="flex flex-col text-center gap-4 p-4 bg-neutral-200/15 rounded-xl border max-w-max mx-auto px-10 border-divider">
						<p>No Questions found</p>
						<Link href="?add" className="mx-auto" showAnchorIcon>
							Add a Question
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
