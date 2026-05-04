export default function UserIcon() {
	return (
		<svg
			className="w-5 h-5 text-gray-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
			/>
			<circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
		</svg>
	);
}
