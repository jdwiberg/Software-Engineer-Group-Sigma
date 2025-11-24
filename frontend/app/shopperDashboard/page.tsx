'use client'
import { useState } from "react";
import Lists from "./Lists";
import Receipts from "./Receipts";
import Stores from "./Stores";

type Tab = "lists" | "receipts" | "stores";

export default function ShopperDashboard() {
  const [tab, setTab] = useState<Tab>("lists");

  return (
    <div>
      <h1>Shopper Dashboard</h1>
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