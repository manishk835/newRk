"use client";

import { useEffect, useState } from "react";

type User = {
    name: string;
    phone: string;
    profileImage?: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/me`, {
                    credentials: "include",
                });

                const data = await res.json();
                setUser(data);
                setName(data.name);
                setPreview(data.profileImage || "");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [BASE_URL]);

    const handleImageChange = (file: File) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        if (!image) return user?.profileImage || "";

        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch(`${BASE_URL}/api/upload`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();

        console.log("UPLOAD RESPONSE:", data); // 👈 ADD THIS

        return data.url;
    };
    const handleSave = async () => {
        try {
            setSaving(true);

            const imageUrl = await uploadImage();

            await fetch(`${BASE_URL}/api/auth/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    profileImage: imageUrl,
                }),
            });

            // 🔥 NEW: refresh user data
            const res = await fetch(`${BASE_URL}/api/auth/me`, {
                credentials: "include",
            });

            const updatedUser = await res.json();

            setUser(updatedUser);
            setPreview(updatedUser.profileImage);

            alert("Profile updated successfully");

        } catch {
            alert("Error updating profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-lg font-semibold">My Profile</h1>
                <p className="text-sm text-gray-500">
                    Manage your personal information
                </p>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white border rounded-2xl p-6 space-y-6">

                {/* IMAGE */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        {preview ? (
                            <img
                                src={preview}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black text-white text-xl font-semibold">
                                {user?.name?.[0]}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium cursor-pointer">
                            <span className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                                Change Photo
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    e.target.files && handleImageChange(e.target.files[0])
                                }
                            />
                        </label>

                        <p className="text-xs text-gray-500 mt-2">
                            JPG, PNG (Max 2MB)
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <input
                            value={user?.phone}
                            disabled
                            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-gray-100"
                        />
                    </div>

                </div>

                {/* SAVE BUTTON */}
                <div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </div>

        </div>
    );
}