"use client";

import type { SwitchProps } from "@nextui-org/react";

import React from "react";
import { Switch } from "@nextui-org/react";

import { cn } from "./cn";

export type SwitchCellProps = SwitchProps & {
	label: string;
	description: string;
};

const SwitchCell = React.forwardRef<HTMLInputElement, SwitchCellProps>(({ label, description, ...props }, ref) => (
	<Switch
		ref={ref}
		color="danger"
		classNames={{
			base: cn("inline-flex bg-content1/60 border flex-row-reverse w-full max-w-full items-center", "justify-between cursor-pointer rounded-xl gap-2 p-4"),
		}}
		{...props}>
		<div className="flex flex-col">
			<p className="text-medium">{label}</p>
			<p className="text-small text-default-500">{description}</p>
		</div>
	</Switch>
));

export const SwitchCellTop = React.forwardRef<HTMLInputElement, SwitchCellProps>(({ label, description, ...props }, ref) => (
	<Switch
		ref={ref}
		color="danger"
		classNames={{
			base: cn("inline-flex bg-content1/60 border border-b-none flex-row-reverse w-full max-w-full items-center", "justify-between cursor-pointer rounded-t-xl gap-2 p-4"),
		}}
		{...props}>
		<div className="flex flex-col">
			<p className="text-medium">{label}</p>
			<p className="text-small text-default-500">{description}</p>
		</div>
	</Switch>
));

export const SwitchCellMiddle = React.forwardRef<HTMLInputElement, SwitchCellProps>(({ label, description, ...props }, ref) => (
	<Switch
		ref={ref}
		color="danger"
		classNames={{
			base: cn("inline-flex bg-content1/60 border-x border-b flex-row-reverse w-full max-w-full items-center", "justify-between cursor-pointer gap-2 p-4"),
		}}
		{...props}>
		<div className="flex flex-col">
			<p className="text-medium">{label}</p>
			<p className="text-small text-default-500">{description}</p>
		</div>
	</Switch>
));

export const SwitchCellBottom = React.forwardRef<HTMLInputElement, SwitchCellProps>(({ label, description, ...props }, ref) => (
	<Switch
		ref={ref}
		color="danger"
		classNames={{
			base: cn("inline-flex bg-content1/60 border border-t-0 flex-row-reverse w-full max-w-full items-center", "justify-between cursor-pointer rounded-b-xl gap-2 p-4"),
		}}
		{...props}>
		<div className="flex flex-col">
			<p className="text-medium">{label}</p>
			<p className="text-small text-default-500">{description}</p>
		</div>
	</Switch>
));

SwitchCell.displayName = "SwitchCell";

export default SwitchCell;
