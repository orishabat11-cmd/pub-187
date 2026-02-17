"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

type Card = {
  id: string;
  cardNumber: number;
  budgetNumber: string;
  totalPunches: number;
  punchesLeft: number;
  active: boolean;
};

export default function BartenderPage() {
  const [budgetSearch, setBudgetSearch] = useState("");
  const [newBudgetNumber, setNewBudgetNumber] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const canCreate = useMemo(
    () => newBudgetNumber.trim().length > 0,
    [newBudgetNumber]
  );

  async function loadCards() {
    setLoading(true);
    setMsg("");

    try {
      const cardsRef = collection(db, "cards");

      const q = budgetSearch.trim()
        ? query(
            cardsRef,
            where("budgetNumber", "==", budgetSearch.trim()),
            orderBy("cardNumber", "desc"),
            limit(50)
          )
        : query(cardsRef, orderBy("cardNumber", "desc"), limit(50));

      const snap = await getDocs(q);

      const rows: Card[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setCards(rows);
    } catch {
      setMsg("שגיאה בטעינת כרטיסיות");
    } finally {
      setLoading(false);
    }
  }

  async function createCard() {
    if (!canCreate) return;

    setLoading(true);
    setMsg("");

    try {
      const counterRef = doc(db, "meta", "counters");

      const nextNumber = await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);

        if (!snap.exists()) {
          throw new Error("חסר meta/counters עם nextCardNumber");
        }

        const current = (snap.data() as any).nextCardNumber;

        tx.update(counterRef, { nextCardNumber: current + 1 });

        return current as number;
      });

      await addDoc(collection(db, "cards"), {
        cardNumber: nextNumber,
        budgetNumber: newBudgetNumber.trim(),
        totalPunches: 20,
        punchesLeft: 20,
        active: true,
        createdAt: serverTimestamp(),
      });

      setNewBudgetNumber("");
      setMsg(`נוצרה כרטיסיה #${nextNumber}`);

      await loadCards();
    } catch (e: any) {
      setMsg(e?.message || "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>מסך ברמן 🍺</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="מספר תקציב"
          value={newBudgetNumber}
          onChange={(e) => setNewBudgetNumber(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />

        <button onClick={createCard} disabled={loading || !canCreate}>
          צור כרטיסיה
        </button>
      </div>

      {msg && <div style={{ color: "crimson" }}>{msg}</div>}

      <ul>
        {cards.map((c) => (
          <li key={c.id}>
            #{c.cardNumber} | {c.budgetNumber} | {c.punchesLeft}/{c.totalPunches}
          </li>
        ))}
      </ul>
    </main>
  );
}
