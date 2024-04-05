"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button, ScrollShadow, Textarea } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addCandidateAnswers } from "./actions";
import { toast } from "sonner";
import { removeSearchParams } from "@/lib/searchParams";
import { flushSync } from "react-dom";

export function QuestionsModal({ questions, selectedElection, candidate, answers }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function addCandidateAnswersHandler(formData: FormData) {
		flushSync(() => {
			setIsLoading(true);
		});
		formData.append("electionYear", selectedElection.election_year);
		formData.append("candidateId", candidate?.id);
		const res = await addCandidateAnswers(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setIsLoading(false);
			return;
		}
		setIsLoading(false);
		removeSearchParams({ answers: "" }, router);
		router.refresh();
	}

	return (
		<Modal placement="center" scrollBehavior="inside" isOpen={!!searchParams.get("answers")} onClose={() => removeSearchParams({ answers: "" }, router)}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h2>Edit Candidate Questions</h2>
					<p className="text-sm">We recommend writing your answers in an external word processor and then pasting your answers here.</p>
				</ModalHeader>
				<ModalBody>
					<ScrollShadow>
						<form id="main" action={addCandidateAnswersHandler}>
							<ul className="flex flex-col gap-4">
								{questions.map((question) => {
									const processedTitle = question.title.replace("#type", "Boy");
									const answer = answers.find((answer) => answer.question.id === question.id);
									return (
										<li key={question.id}>
											<Textarea defaultValue={answer?.content} description="500 words max" name={question.id} label={question.title} />
										</li>
									);
								})}
							</ul>
						</form>
					</ScrollShadow>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="light" onPress={() => removeSearchParams({ answers: "" }, router)}>
						Close
					</Button>
					<Button color="primary" type="submit" form="main">
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
