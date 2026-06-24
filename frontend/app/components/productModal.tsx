"use client";

import React from "react";

interface Product {
	id?: string;
	_id?: string;
	name: string;
	price: number;
	description: string;
	imageURL: string;
}

interface ProductModalProps {
	product: Product | null;
	onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
	if (!product) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
			<div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary/20 bg-background text-text shadow-2xl transition-transform duration-300 scale-100">
				{/* Close Trigger Icon */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-text hover:text-primary transition-colors border border-secondary/10 shadow"
					aria-label="Close modal"
				>
					✕
				</button>

				<div className="grid grid-cols-1 md:grid-cols-2">
					{/* Media Display Area */}
					<div className="relative h-64 w-full md:h-full min-h-[300px] bg-secondary/5">
						<img
							src={product.imageURL}
							alt={product.name}
							className="h-full w-full object-cover"
						/>
					</div>

					{/* Metadata Content Context */}
					<div className="flex flex-col justify-between p-6 md:p-8">
						<div>
							<h2 className="text-xl font-black tracking-tight mb-3 mt-4 md:mt-0 text-primary">
								{product.name}
							</h2>
							<p className="text-sm leading-relaxed text-text/80 mb-6">
								{product.description}
							</p>
						</div>

						<div>
							<div className="flex items-baseline gap-2 mb-4">
								<span className="text-2xl font-black text-text">
									${product.price.toFixed(2)}
								</span>
							</div>

							<button
								onClick={() => alert(`${product.name} added to cart!`)}
								className="w-full font-bold uppercase tracking-wider rounded-xl bg-primary hover:bg-primary/90 text-white py-3 px-4 shadow transition-all duration-200 active:scale-[0.98]"
							>
								Add To Basket
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
