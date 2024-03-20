"use client";

import Icon from "@/components/ui/Icon";
import { Accordion, AccordionItem } from "@nextui-org/react";

export function AnswerAccordion({ faqs }) {
	return (
		<Accordion
			fullWidth
			keepContentMounted
			itemClasses={{
				base: "px-0 md:px-2 md:px-6",
				title: "font-medium text-center",
				trigger: "py-6 flex-row-reverse",
				content: "pt-0 pb-6 text-base text-default-500",
				indicator: "rotate-0 data-[open=true]:-rotate-45",
			}}
			items={faqs}
			selectionMode="multiple">
			{faqs.map((item, i) => (
				<AccordionItem key={i} indicator={<Icon className="text-white" icon="lucide:plus" width={24} />} title={item.title}>
					{item.content}
				</AccordionItem>
			))}
		</Accordion>
	);
}

export default AnswerAccordion;
