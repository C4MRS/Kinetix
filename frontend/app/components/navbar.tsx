"use client";

import React, { useState } from "react";
import Link from "next/link";
import DarkModeToggle from "../components/darkModeToggle";

import SignInIcon from "./icons/signInIcon";
import BasketIcon from "./icons/basketIcon";
import UserIcon from "./icons/userIcon";

export default function Navbar() {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [userProfile, setUserProfile] = useState({ name: "Mario" });

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background text-text transition-colors duration-300">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex-shrink-0">
						<Link href="/" className="flex items-center gap-2">
							<span className="text-2xl font-black tracking-wider text-primary hover:text-primary-hover transition-colors cursor-pointer">
								KINETIX
							</span>
						</Link>
					</div>
					<div className="flex items-center gap-4 sm:gap-6">
						{!isLoggedIn ? (
							<Link
								href="/login"
								className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
							>
								<SignInIcon className="w-5 h-5" />
								<span className="hidden sm:inline">Sign in</span>
							</Link>
						) : (
							<>
								<Link
									href="/"
									className="relative p-1.5 hover:text-primary transition-colors"
									aria-label="Basket"
								>
									<BasketIcon className="w-5 h-5" />
									<span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
										2
									</span>
								</Link>
								<Link
									href="/"
									className="flex items-center gap-2 p-1 hover:text-primary transition-colors"
								>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
										<UserIcon />
									</div>
									<span className="hidden text-sm font-semibold sm:block">
										{userProfile.name}
									</span>
								</Link>
							</>
						)}
						<DarkModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}
