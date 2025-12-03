'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Lists from "./Lists";
import Receipts from "./Receipts";
import Stores from "./Stores";
import { useRouter } from "next/navigation";

type Tab = "lists" | "receipts" | "stores";

export default function ShopperDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: Tab =
    tabParam === "lists" || tabParam === "receipts" || tabParam === "stores"
      ? tabParam
      : "lists";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (tabParam === "lists" || tabParam === "receipts" || tabParam === "stores") {
      setTab(tabParam);
    }
  }, [tabParam]);

  async function logout() {
    localStorage.setItem("username", "");
    router.push("/");
  }

  return (
    <div>
      <h1>{localStorage.getItem("username")}'s Shopper Dashboard</h1>
      <button onClick={() => logout()}>Logout</button>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setTab("lists")}>Shopping Lists</button>
        <button onClick={() => setTab("receipts")}>Receipts</button>
        <button onClick={() => setTab("stores")}>Stores</button>
      </div>
      <hr />
      {tab === "lists" && <Lists />}
      {tab === "receipts" && <Receipts />}
      {tab === "stores" && <Stores />}
    </div>
  );
}
