// src/app/(protected)/verify-id/page.tsx — simplified sketch
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import axiosInstance from "@/lib/axios"; // your configured axios with Bearer token
import { API_URL } from "@/types/constants";
import { axiosInstance } from "@refinedev/nestjsx-crud";

export default function VerifyIdPage() {
  const router = useRouter();
  const [officialId, setOfficialId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post(`${API_URL}/account/link-employee`, {
        officialId,
      });
      router.replace("/fts");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={officialId}
        onChange={(e) => setOfficialId(e.target.value)}
        placeholder="Enter your 10-digit Employee ID"
        maxLength={10}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
