import { useEffect, useState } from "react";

export function useAiAdvice({ budgets, budgetProgress, transactions }: {
  budgets: { category: string; limit: number }[];
  budgetProgress: Record<string, number>;
  transactions: any[];
}) {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // IA local simulada
      if (!budgets.length || !transactions.length) {
        setAdvice("");
        setLoading(false);
        return;
      }
      const totalExpenses = Object.values(budgetProgress).reduce((a, b) => a + b, 0);
      const totalBudgets = budgets.reduce((a, b) => a + b.limit, 0);
      let conselhos: string[] = [];
      if (totalExpenses > totalBudgets) {
        conselhos.push("Você ultrapassou o limite total de orçamento. Reveja suas despesas e tente priorizar categorias essenciais.");
      } else if (totalExpenses < totalBudgets * 0.7) {
        conselhos.push("Parabéns! Você está mantendo seus gastos bem abaixo do limite definido. Considere investir a economia ou aumentar sua meta de poupança.");
      }
      const maisCritica = budgets
        .map(b => ({
          ...b,
          percent: budgetProgress[b.category] ? (budgetProgress[b.category] / b.limit) * 100 : 0
        }))
        .sort((a, b) => b.percent - a.percent)[0];
      if (maisCritica && maisCritica.percent > 90 && maisCritica.percent <= 100) {
        conselhos.push(`Atenção: você está muito próximo do limite em "${maisCritica.category}". Considere reduzir gastos nessa categoria este mês.`);
      }
      if (maisCritica && maisCritica.percent > 120) {
        conselhos.push(`Você ultrapassou em mais de 20% o limite da categoria "${maisCritica.category}". Reveja seus hábitos ou ajuste seu orçamento.`);
      }
      if (budgets.length > 2) {
        const concentracao = Object.values(budgetProgress).sort((a, b) => b - a)[0] / (totalExpenses || 1);
        if (concentracao > 0.6) {
          conselhos.push("Seus gastos estão muito concentrados em uma única categoria. Tente diversificar para evitar riscos financeiros.");
        }
      }
      if (conselhos.length === 0) {
        conselhos.push("Continue acompanhando seus gastos e ajustando seus orçamentos para manter sua saúde financeira!");
      }
      setAdvice(conselhos.join("\n\n"));
      setLoading(false);
    }, 800);
  }, [budgets, budgetProgress, transactions]);

  return { advice, loading, error };
}
