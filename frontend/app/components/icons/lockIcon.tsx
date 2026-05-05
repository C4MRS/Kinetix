export default function LockIcon() {
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
				d="M12 11c-1.1 0-2 .9-2 2v2h4v-2c0-1.1-.9-2-2-2z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M17 11V7a5 5 0 10-10 0v4"
			/>
			<rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={2} />
		</svg>
	);
}
