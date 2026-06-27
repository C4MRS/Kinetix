"use client";

import React, { useState, useEffect } from "react";
import ProductModal from "./components/productModal";

interface Product {
  _id?: string;
  name: string;
  price: number;
  description: string;
  imageURL: string;
  tags: string[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const fetchProducts = async (query: string) => {
    try {
      setLoading(true);

      let endpoint = "";

      // TEXT SEARCH
      if (query.trim()) {
        endpoint = `http://localhost:3001/api/search?q=${encodeURIComponent(query)}`;
      } else {
        endpoint = `http://localhost:3001/api/products`;
      }

      const res = await fetch(endpoint);

      // ❗ IMPORTANT FIX: evita HTML crash
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server did not return JSON:", text);
        setProducts([]);
        return;
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("API error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  // 🧠 IMAGE SEARCH (Azure Vision)
  const handleImageUpload = async (file: File) => {
    setImage(file);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3001/api/search/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setProducts(data || []);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-text">
      {/* HERO */}
      <section className="p-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Sport AI Search</h1>

        {/* TEXT SEARCH */}
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search football, gym, tennis..."
          className="w-full max-w-md p-3 rounded-xl border"
        />

        {/* IMAGE SEARCH */}
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleImageUpload(e.target.files[0])
            }
          />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((p, i) => (
            <div
              key={i}
              onClick={() => setSelectedProduct(p)}
              className="border rounded-xl p-3 cursor-pointer"
            >
              <img src={p.imageURL} className="w-full h-40 object-cover" />
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm">{p.price}€</p>
            </div>
          ))
        )}
      </section>

      <ProductModal
        key={selectedProduct?._id ?? "closed"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
