"use client";

import React from "react";
import { Button, Input, Checkbox, Divider, Chip, Link, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ESLogo from "@/public/assets/branding/logos/es-logo.svg";
import ESLogoWhite from "@/public/assets/branding/logos/es-logo-white.svg";
import { studentLoginHandler } from "./login.server";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { flushSync } from "react-dom";
import { toast } from "sonner";

export default function Component() {
	const [isVisible, setIsVisible] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);
	const images = [{ src: "/assets/branding/english-school-6.jpg", logo: ESLogoWhite, backgroundPosition: "center" }];
	const router = useRouter();
	const randomImage = Math.floor(Math.random() * images.length);
	const searchparams = useSearchParams();

	async function loginHandler(formData: any) {
		flushSync(() => {
			setIsLoading(true);
		});
		const response = await studentLoginHandler(formData);
		if (!response.ok) {
			toast.error("We couldn't sign you in. Please check your credentials and try again.");
			flushSync(() => {
				setIsLoading(false);
			});
			return;
		}
		toast("You have been successfully signed in.");
		setIsLoading(false);
		const isInStandaloneMode = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone || document.referrer.includes("android-app://");
		if (isInStandaloneMode()) {
			redirect("/dashboard");
		}
		redirect(searchparams.get("return") || "/");
	}

	return (
		<div
			className="flex h-screen w-screen pwa:!bg-white items-center shadow-xl justify-center overflow-hidden bg-content1 p-2 sm:p-4 md:justify-end lg:p-8"
			style={{
				backgroundImage: `url(${images[randomImage].src})`,
				backgroundSize: "cover",
				backgroundPosition: images[randomImage].backgroundPosition,
				backgroundRepeat: "no-repeat",
			}}>
			{/* Brand Logo */}
			<div className="absolute top-10 mx-auto md:left-10">
				<div className="flex items-center">
					<Link href="/">
						<Image src={images[randomImage].logo} alt="The English School Logo" width={300} />
					</Link>
				</div>
			</div>

			{/* Testimonial 
			<div className="absolute bottom-10 left-10 hidden md:block">
				<p className="max-w-xl text-white/60">
					<span className="font-medium">“</span>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa volutpat aliquet.
					<span className="font-medium">”</span>
				</p>
			</div>*/}

			{/* Login Form */}
			<div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1/90 px-8 pb-10 pt-6 shadow-small">
				<div>
					<p className="text-xl font-medium">Login</p>
					<Spacer y={1} />
					<p className="text-sm font-medium">All students in years 3 to 6 can log in with their School (Microsoft) Accounts.</p>
				</div>
				<form className="flex flex-col gap-3" action={loginHandler}>
					<Input className="" size="lg" label="Email Address or Student ID" color="success" name="username" type="text" variant="" />
					<Input
						endContent={
							<button type="button" onClick={toggleVisibility}>
								{isVisible ? <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" /> : <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />}
							</button>
						}
						name="password"
						size="lg"
						label="Enter your Password"
						type={isVisible ? "text" : "password"}
					/>
					<div className="flex items-center justify-between px-1 py-2">
						<Checkbox classNames={{ wrapper: "bg-neutral-400" }} name="remember" size="sm">
							Remember me
						</Checkbox>
						<Link onPress={() => toast.info("Please visit the IT Department Science Building Office to get your password reset.", { duration: 5000, description: " It may take up to an hour after you change your password for you to be able to log in here." })} className="text-default-500 cursor-pointer" size="sm">
							Forgot password?
						</Link>
					</div>
					<Button isLoading={isLoading} color="primary" type="submit">
						Login
					</Button>
				</form>
				{/* 	<div className="flex items-center gap-4 py-1">
					<Divider className="flex-1" />
					<p className="shrink-0 text-tiny text-default-500">OR</p>
					<Divider className="flex-1" />
				</div>
				<div className="flex flex-col gap-2">
					<Button variant="bordered">Login as Admin</Button>
				</div> */}
				<p className="text-center text-small">
					Trouble logging in?&nbsp;
					<Link onPress={() => toast.info("Please visit the IT Department Science Building Office to get your password reset.", { duration: 5000, description: " It may take up to an hour after you change your password for you to be able to log in here." })} href="#" size="sm">
						Help
					</Link>
				</p>
			</div>
		</div>
	);
}
