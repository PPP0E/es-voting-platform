"use client";

import { uploadProfilePicture, deleteProfilePicture } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input, Button, ButtonGroup, Avatar } from "@nextui-org/react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { removeSearchParams } from "@/lib/searchParams";

export default function ManagementProfilePictureFrame({ candidate }) {
	console.log("candidate", candidate);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [url, setUrl] = useState(`/api/users/${candidate.id}/avatar`);
	const [profilePictureInput, setProfilePictureInput] = useState("");

	async function updateProfilePictureHandler(formData: FormData) {
		flushSync(() => {
			setLoading(true);
		});
		formData.append("id", candidate.id);
		const res = await uploadProfilePicture(formData);
		if (!res?.ok) {
			toast.error(res?.message);
			setLoading(false);
			return;
		}
		setLoading(false);
		toast.success("Profile picture updated");
		router.refresh();
	}

	async function removeProfilePictureHandler() {
		setLoading(true);
		const res = await deleteProfilePicture(candidate.id);
		if (!res?.ok) {
			toast.error(res?.message);
			setLoading(false);
			return;
		}
		setLoading(false);
		toast.success("Profile picture removed");
		setProfilePictureInput("");
		router.refresh();
	}

	const onImageUpdate = (e) => {
		const profilePicture = e.target.files[0];
		if (!profilePicture) {
			toast("No file selected.");
			return;
		}
		if (profilePicture.size > 10000000) {
			toast("The maximun file size is 10MB");
			return;
		}
		if (!["image/png", "image/gif", "image/jpeg"].includes(profilePicture.type)) {
			toast("File type is not supported");
			return;
		}
		setProfilePictureInput(e.target.value);
		setUrl(URL.createObjectURL(e.target.files[0]));
	};

	return (
		<div className="flex flex-col">
			<div className="flex">
				<Avatar key={Math.random()} isBordered showFallback className="ml-1 mr-4 mt-1 aspect-square h-[100px] min-h-[100px] w-[100px] min-w-[100px] select-none object-cover" src={candidate.photo || profilePictureInput ? url : null} />
				<div className="flex flex-col gap-2 rounded-2xl">
					<form id="pfpUpdater" action={updateProfilePictureHandler}>
						<input
							className="block w-full text-sm text-slate-500
      file:my-1 file:mr-4 file:rounded-full
      file:border-0 file:bg-black-600
      file:px-4 file:py-2 file:text-sm
      file:font-semibold file:text-medired
      hover:file:bg-violet-100"
							accept=".jpg,.jpeg,.gif,.png"
							placeholder=" "
							onChange={onImageUpdate}
							name="photo"
							type="file"
						/>
					</form>
					<div className="flex gap-4">
						{candidate.photo && (
							<Button isLoading={loading} onClick={removeProfilePictureHandler} isDisabled={loading} className="w-full" type="submit">
								{!loading ? "Remove" : "Loading"}
							</Button>
						)}
						<Button isLoading={loading} form="pfpUpdater" disabled={loading} isDisabled={loading || !profilePictureInput} className="w-full" type="submit">
							{!loading ? "Upload" : "Uploading"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
