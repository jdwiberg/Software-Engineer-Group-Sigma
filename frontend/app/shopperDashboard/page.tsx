'use client'
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Lists from "./Lists";
import Receipts from "./Receipts";
import Stores from "./Stores";
import Review from "./Review"
import { useRouter } from "next/navigation";

type Tab = "lists" | "receipts" | "stores" | "review";

function ShopperDashboardInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: Tab =
    tabParam === "lists" || tabParam === "receipts" || tabParam === "stores" || tabParam === "review"
      ? tabParam
      : "lists";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      router.push("/")
      return
    }
    setUsername(localStorage.getItem("username"))
  })

  useEffect(() => {
    if (tabParam === "lists" || tabParam === "receipts" || tabParam === "stores" || tabParam === "review") {
      setTab(tabParam);
    }
  }, [tabParam]);

  async function logout() {
    localStorage.setItem("username", "");
    router.push("/");
  }

  return (
    <div>
      <div>
      <button onClick={() => logout()}>Logout</button>
      </div>
      <div className="header">
        <h1>Welcome, {username}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTab("lists")}>Shopping Lists</button>
          <button onClick={() => setTab("receipts")}>Receipts</button>
          <button onClick={() => setTab("stores")}>Stores</button>
          <button onClick={() => setTab("review")}>Review</button>
        </div>
      </div>
      <hr />
      {tab === "lists" && <Lists />}
      {tab === "receipts" && <Receipts />}
      {tab === "stores" && <Stores />}
      {tab === "review" && <Review />}
    </div>
  );
}

export default function ShopperDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopperDashboardInner />
    </Suspense>
  );
}
