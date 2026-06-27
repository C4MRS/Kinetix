"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleClose = () => {
    setFeedback("");
    setHasError(false);
    setIsAdding(false);
    onClose();
  };

  if (!product) {
    return null;
  }

  const handleAddToBasket = async () => {
    const productId = product._id ?? product.id;

    if (!productId) {
      setHasError(true);
      setFeedback("Product ID is missing");
      return;
    }

    setIsAdding(true);
    setFeedback("");
    setHasError(false);

    try {
      const response = await fetch(`${API_URL}/api/basket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Unable to add product to basket");
      }

      setFeedback("Product added to basket!");

      window.dispatchEvent(new Event("basket-updated"));
    } catch (error) {
      setHasError(true);

      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to add product to basket",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary/20 bg-background text-text shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-secondary/10 bg-background/80 text-text shadow transition-colors hover:text-primary"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative min-h-[300px] h-64 w-full bg-secondary/5 md:h-full">
            <img
              src={product.imageURL}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <h2 className="mb-3 mt-4 text-xl font-black tracking-tight text-primary md:mt-0">
                {product.name}
              </h2>

              <p className="mb-6 text-sm leading-relaxed text-text/80">
                {product.description}
              </p>
            </div>

            <div>
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-2xl font-black text-text">
                  €{product.price.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void handleAddToBasket()}
                disabled={isAdding}
                className="w-full rounded-xl bg-primary px-4 py-3 font-bold uppercase tracking-wider text-white shadow transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "Add To Basket"}
              </button>

              {feedback && (
                <p
                  className={`mt-3 text-center text-sm ${
                    hasError ? "text-secondary" : "text-primary"
                  }`}
                >
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
