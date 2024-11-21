"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  fullName: string;
  email: string;
  company: string;
  role: string;
}

export default function Survey() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!uuid) {
          throw new Error("No UUID provided");
        }

        const response = await fetch(`/api/users/${uuid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome, {user.fullName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Company:</strong> {user.company}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Survey content will be added here */}
        <Card>
          <CardHeader>
            <CardTitle>Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Survey questions will be implemented here...</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}