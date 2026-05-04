import React from "react";

type InputProps = {
	type: string;
	name: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	icon?: React.ReactNode;
};

export default function Input({
	type,
	name,
	placeholder,
	value,
	onChange,
	icon,
}: InputProps) {
	return (
		<div className="shadow-lg flex gap-2 items-center bg-transparent p-2 hover:shadow-xl duration-300 hover:border-2 border-gray-400 group delay-200 rounded-md">
			{/* ICONA */}
			{icon && (
				<div className="group-hover:rotate-[360deg] duration-300">{icon}</div>
			)}

			{/* INPUT */}
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="flex-1 focus:outline-none bg-transparent"
			/>
		</div>
	);
}
