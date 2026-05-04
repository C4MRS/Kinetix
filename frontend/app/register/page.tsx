"use client";

import { useState } from "react";
import Input from "../components/input";

import MailIcon from "../components/icons/mailIcon";
import UserIcon from "../components/icons/userIcon";
import LockIcon from "../components/icons/lockIcon";

type FormData = {
	email: string;
	name: string;
	surname: string;
	password: string;
};

export default function RegisterPage() {
	const [form, setForm] = useState<FormData>({
		email: "",
		name: "",
		surname: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setSuccess("");

		try {
			const res = await fetch("http://localhost:3001/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const data = await res.json().catch(() => null);

			if (!res.ok) {
				setError(data?.message || "Error during sign up");
				return;
			}

			setSuccess("Sign Up completed!");

			setForm({
				email: "",
				name: "",
				surname: "",
				password: "",
			});
		} catch {
			setError("Connection Error");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background text-text transition-colors duration-300">
			<form
				onSubmit={handleSubmit}
				className="bg-background/80 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
			>
				<h1 className="text-2xl font-bold text-center text-primary">Sign Up</h1>

				<Input
					type="email"
					name="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					icon={<MailIcon />}
				/>

				<Input
					type="text"
					name="name"
					placeholder="Name"
					value={form.name}
					onChange={handleChange}
					icon={<UserIcon />}
				/>

				<Input
					type="text"
					name="surname"
					placeholder="Surname"
					value={form.surname}
					onChange={handleChange}
					icon={<UserIcon />}
				/>

				<Input
					type="password"
					name="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					icon={<LockIcon />}
				/>

				<button className="btn btn-primary w-full">Register</button>

				{error && <p className="text-secondary text-sm text-center">{error}</p>}

				{success && (
					<p className="text-primary text-sm text-center">{success}</p>
				)}
			</form>
		</div>
	);
}
