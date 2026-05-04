"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setDark(isDark);
	}, []);

	const toggleDark = () => {
		if (dark) {
			document.documentElement.classList.remove("dark");
			setDark(false);
		} else {
			document.documentElement.classList.add("dark");
			setDark(true);
		}
	};

	return (
		<button
			onClick={toggleDark}
			className="btn btn-soft-primary fixed top-4 right-4"
		>
			{dark ? "☀️ Light" : "🌙 Dark"}
		</button>
	);
}
