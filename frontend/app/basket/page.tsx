"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Product = {
  _id: string;
  imageURL: string;
  name: string;
  description: string;
  price: number;
};

type BasketItem = {
  _id: string;
  productId: Product;
  quantity: number;
};

type BasketResponse = {
  message: string;
  basketItems: BasketItem[];
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price);

export default function BasketPage() {
  const router = useRouter();

  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  const loadBasket = useCallback(async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/basket`, {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const data = (await response.json().catch(() => null)) as
        | BasketResponse
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load the basket");
      }

      setBasketItems(data && "basketItems" in data ? data.basketItems : []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load the basket",
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadBasket();
  }, [loadBasket]);

  const totalPrice = useMemo(
    () =>
      basketItems.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0,
      ),
    [basketItems],
  );

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    setUpdatingProductId(productId);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/basket/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update the quantity");
      }

      setBasketItems((currentItems) =>
        currentItems.map((item) =>
          item.productId._id === productId ? data.basketItem : item,
        ),
      );

      window.dispatchEvent(new Event("basket-updated"));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update the quantity",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeProduct = async (productId: string) => {
    setUpdatingProductId(productId);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/basket/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to remove the product");
      }

      setBasketItems((currentItems) =>
        currentItems.filter((item) => item.productId._id !== productId),
      );

      window.dispatchEvent(new Event("basket-updated"));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to remove the product",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background px-4 text-text">
        <p className="text-lg">Loading basket...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 bg-background px-4 py-10 text-text transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
            Your Basket
          </h1>
          <p className="mt-2 text-sm opacity-70">
            Review your products and update their quantities.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-sm">
            {error}
          </div>
        )}

        {basketItems.length === 0 ? (
          <section className="rounded-2xl border border-primary/20 bg-background/80 p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold">Your basket is empty</h2>
            <p className="mt-2 opacity-70">
              Add some products to start your order.
            </p>
            <Link href="/" className="btn btn-primary mt-6 inline-flex">
              Continue shopping
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              {basketItems.map((item) => {
                const product = item.productId;
                const isUpdating = updatingProductId === product._id;

                return (
                  <article
                    key={item._id}
                    className="flex flex-col gap-5 rounded-2xl border border-primary/20 bg-background/80 p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      className="h-36 w-full rounded-xl object-cover sm:h-28 sm:w-36"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold">{product.name}</h2>
                      <p className="mt-1 line-clamp-2 text-sm opacity-70">
                        {product.description}
                      </p>
                      <p className="mt-3 font-semibold text-primary">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease ${product.name} quantity`}
                          disabled={isUpdating || item.quantity === 1}
                          onClick={() =>
                            void updateQuantity(product._id, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 font-bold hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${product.name} quantity`}
                          disabled={isUpdating}
                          onClick={() =>
                            void updateQuantity(product._id, item.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 font-bold hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold">
                        {formatPrice(product.price * item.quantity)}
                      </p>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void removeProduct(product._id)}
                        className="text-sm font-semibold text-secondary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-sm">
              <h2 className="text-xl font-bold">Order summary</h2>

              <div className="mt-5 flex items-center justify-between border-t border-primary/20 pt-5">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-black text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
