"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import DarkModeToggle from "./darkModeToggle";
import SignInIcon from "./icons/signInIcon";
import BasketIcon from "./icons/basketIcon";
import UserIcon from "./icons/userIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type User = {
  id: string;
  email: string;
  name: string;
  surname?: string;
  role: "user" | "admin";
};

type BasketItem = {
  quantity: number;
};

const fetchCurrentUser = async (): Promise<User | null> => {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return data.user;
};

const fetchBasketCount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/api/basket`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return 0;
  }

  const data = await response.json();

  const basketItems: BasketItem[] = Array.isArray(data.basketItems)
    ? data.basketItems
    : [];

  return basketItems.reduce((total, item) => total + item.quantity, 0);
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [basketCount, setBasketCount] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const synchronizeSession = () => {
      fetchCurrentUser()
        .then(async (currentUser) => {
          if (cancelled) {
            return;
          }

          if (!currentUser) {
            setUser(null);
            setBasketCount(0);
            setIsSessionLoading(false);
            return;
          }

          setUser(currentUser);

          const currentBasketCount = await fetchBasketCount();

          if (cancelled) {
            return;
          }

          setBasketCount(currentBasketCount);
          setIsSessionLoading(false);
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          setUser(null);
          setBasketCount(0);
          setIsSessionLoading(false);
        });
    };

    const handleAuthChange = () => {
      synchronizeSession();
    };

    synchronizeSession();

    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      cancelled = true;

      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const handleBasketUpdate = () => {
      fetchBasketCount()
        .then((currentBasketCount) => {
          if (!cancelled) {
            setBasketCount(currentBasketCount);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setBasketCount(0);
          }
        });
    };

    window.addEventListener("basket-updated", handleBasketUpdate);

    return () => {
      cancelled = true;

      window.removeEventListener("basket-updated", handleBasketUpdate);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to log out");
      }

      setUser(null);
      setBasketCount(0);

      window.dispatchEvent(new Event("auth-changed"));

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      window.alert(
        error instanceof Error ? error.message : "Unable to log out",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background text-text transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="cursor-pointer text-2xl font-black tracking-wider text-primary transition-colors hover:text-primary-hover">
              KINETIX
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {!isSessionLoading && !user && (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
              >
                <SignInIcon className="h-5 w-5" />

                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}

            {!isSessionLoading && user && (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10"
                  >
                    Admin
                  </Link>
                )}

                <Link
                  href="/basket"
                  aria-label="Open basket"
                  className="relative p-1.5 transition-colors hover:text-primary"
                >
                  <BasketIcon className="h-5 w-5" />

                  {basketCount > 0 && (
                    <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                      {basketCount > 99 ? "99+" : basketCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                    <UserIcon />
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-sm font-semibold">{user.name}</span>

                    {user.role === "admin" && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  className="rounded-lg border border-secondary/30 px-3 py-1.5 text-sm font-semibold transition-colors hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
              </>
            )}

            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
