"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = ["WATCH", "PANTS", "SHIRTS", "JACKETS", "DEAL"];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isFeatured: false,
    category: "WATCH",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/dashboard/products/${id}`);
      const data = await res.json();

      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        isFeatured: data.isFeatured,
        category: data.category,
      });

      setExistingImages(data.images?.map((img: any) => img.url) || []);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e: any) => {
    setNewFiles([...e.target.files]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUpdating(true);

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("category", formData.category);
    fd.append("isFeatured", String(formData.isFeatured));

    newFiles.forEach((file) => fd.append("images", file));

    const res = await fetch(`/api/dashboard/products/${id}`, { method: "PATCH", body: fd });
    if (res.ok) router.push("/dashboard/products");
    else alert("Failed to update");

    setUpdating(false);
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" value={formData.name} onChange={handleChange} required />
        <Textarea name="description" value={formData.description} onChange={handleChange} required />
        <Input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <select
          name="category"
          className="border w-full p-2 rounded"
          value={formData.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.isFeatured}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFeatured: !!checked }))
            }
          />
          <span>Featured Product</span>
        </div>

        <div>
          <p className="font-medium mb-2">Existing Images:</p>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((url, i) => (
              <img key={i} src={url} className="w-24 h-24 object-cover rounded border" />
            ))}
          </div>
        </div>

        <Input type="file" multiple accept="image/*" onChange={handleFiles} />

        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
