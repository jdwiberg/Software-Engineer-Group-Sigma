'use client'
import { useState } from "react";
import Lists from "./Lists";
import Receipts from "./Receipts";
import History from "./History";

type Tab = "lists" | "receipts" | "history";

export default function ShopperDashboard() {
  const [tab, setTab] = useState<Tab>("lists");

  return (
    <div>
      <h1>Shopper Dashboard</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setTab("lists")}>Shopping Lists</button>
        <button onClick={() => setTab("receipts")}>Receipts</button>
        <button onClick={() => setTab("history")}>History</button>
      </div>
      <hr />
      {tab === "lists" && <Lists />}
      {tab === "receipts" && <Receipts />}
      {tab === "history" && <History />}
    </div>
  );
}