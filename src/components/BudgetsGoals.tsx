import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Budget {
  category: string;
  limit: number;
}

interface BudgetsGoalsProps {
  budgets: Budget[];
  onSetBudget: (category: string, limit: number) => void;
  progress: Record<string, number>;
}

export function BudgetsGoals({ budgets, onSetBudget, progress }: BudgetsGoalsProps) {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (category && limit) {
            onSetBudget(category, Number(limit));
            setCategory("");
            setLimit("");
          }
        }}
        className="flex gap-2 mb-4"
      >
        <Input
          placeholder="Categoria"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-32"
        />
        <Input
          placeholder="Limite (R$)"
          type="number"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          className="w-32"
        />
        <Button type="submit">Definir</Button>
      </form>
      <hr className="my-4 border-muted-foreground/20" />
      <div className="space-y-2">
        {budgets.map(b => (
          <div key={b.category} className="flex items-center gap-4">
            <span className="w-32 font-medium">{b.category}</span>
            <span className="w-32">Limite: R$ {b.limit.toFixed(2)}</span>
            <span className="w-32">Gasto: R$ {progress[b.category]?.toFixed(2) || 0}</span>
            <span className={progress[b.category] > b.limit ? "text-expense font-bold" : "text-income font-bold"}>
              {progress[b.category] > b.limit ? "Ultrapassou" : `${Math.round((progress[b.category] || 0) / b.limit * 100)}%`}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
