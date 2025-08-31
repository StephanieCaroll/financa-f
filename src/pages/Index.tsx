import { useState, useMemo } from "react";
import { Transaction, FinancialSummary } from "@/types/finance";
import { StatsCard } from "@/components/StatsCard";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Sparkles, Target, BarChart3 } from "lucide-react";
import { BudgetsGoals } from "@/components/BudgetsGoals";
import { AdvancedReports } from "@/components/AdvancedReports";
import { SmartAlerts } from "@/components/SmartAlerts";


// Mock data for initial state
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    type: 'income',
    category: 'Salário',
    description: 'Salário mensal',
    date: new Date('2024-01-15'),
    notes: 'Salário da empresa XYZ'
  },
  {
    id: '2',
    amount: 250,
    type: 'expense',
    category: 'Alimentação',
    description: 'Supermercado',
    date: new Date('2024-01-16'),
    notes: 'Compras da semana'
  },
  {
    id: '3',
    amount: 80,
    type: 'expense',
    category: 'Transporte',
    description: 'Combustível',
    date: new Date('2024-01-17')
  },
  {
    id: '4',
    amount: 1200,
    type: 'expense',
    category: 'Casa',
    description: 'Aluguel',
    date: new Date('2024-01-18'),
    notes: 'Aluguel do apartamento'
  }
];


const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Estado para orçamentos/metas
  type Budget = { category: string; limit: number };
  const [budgets, setBudgets] = useState<Budget[]>([]);
  // Progresso de gastos por categoria
  const budgetProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        progress[t.category] = (progress[t.category] || 0) + t.amount;
      }
    });
    return progress;
  }, [transactions]);
  const handleSetBudget = (category: string, limit: number) => {
    setBudgets(prev => {
      const exists = prev.find(b => b.category === category);
      if (exists) {
        return prev.map(b => b.category === category ? { ...b, limit } : b);
      }
      return [...prev, { category, limit }];
    });
  };

  // Alertas inteligentes + conselhos de IA
  const alerts = useMemo(() => {
    const baseAlerts = budgets
      .filter(b => budgetProgress[b.category] > b.limit)
      .map(b => `Você ultrapassou o limite de R$ ${b.limit.toFixed(2)} na categoria "${b.category}"!`);

    // Conselhos de IA baseados nos dados
    const advices: string[] = [];
    const totalExpenses = Object.values(budgetProgress).reduce((a, b) => a + b, 0);
    const totalBudgets = budgets.reduce((a, b) => a + b.limit, 0);
    if (budgets.length > 0 && totalExpenses > totalBudgets) {
      advices.push("Seus gastos totais ultrapassaram o limite definido. Reveja suas despesas e tente priorizar categorias essenciais.");
    }
    if (budgets.length > 0 && totalExpenses < totalBudgets * 0.7) {
      advices.push("Parabéns! Você está mantendo seus gastos bem abaixo do limite definido. Considere investir a economia ou aumentar sua meta de poupança.");
    }
    // Dica para categoria mais crítica
    const maisCritica = budgets
      .map(b => ({
        ...b,
        percent: budgetProgress[b.category] ? (budgetProgress[b.category] / b.limit) * 100 : 0
      }))
      .sort((a, b) => b.percent - a.percent)[0];
    if (maisCritica && maisCritica.percent > 90 && maisCritica.percent <= 100) {
      advices.push(`Atenção: você está muito próximo do limite em "${maisCritica.category}". Considere reduzir gastos nessa categoria este mês.`);
    }
    if (maisCritica && maisCritica.percent > 120) {
      advices.push(`Você ultrapassou em mais de 20% o limite da categoria "${maisCritica.category}". Reveja seus hábitos ou ajuste seu orçamento.`);
    }
    // Dica de diversificação
    if (budgets.length > 2) {
      const concentracao = Object.values(budgetProgress).sort((a, b) => b - a)[0] / (totalExpenses || 1);
      if (concentracao > 0.6) {
        advices.push("Seus gastos estão muito concentrados em uma única categoria. Tente diversificar para evitar riscos financeiros.");
      }
    }
    return [...baseAlerts, ...advices];
  }, [budgets, budgetProgress]);

  // Relatórios avançados: sumariza por mês
  const advancedReportsData = useMemo(() => {
    const map = new Map<string, { income: number; expenses: number; balance: number }>();
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map.has(key)) map.set(key, { income: 0, expenses: 0, balance: 0 });
      const entry = map.get(key)!;
      if (t.type === 'income') entry.income += t.amount;
      if (t.type === 'expense') entry.expenses += t.amount;
      entry.balance = entry.income - entry.expenses;
    });
    // Ordena por data
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: key,
        ...val
      }));
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Editando existente
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...newTransaction } : t));
      setEditingTransaction(null);
    } else {
      // Nova transação
      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString(),
      };
      setTransactions(prev => [transaction, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const financialSummary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome - totalExpenses;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const prevMonthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
    });

    const monthlyIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const prevMonthlyIncome = prevMonthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const prevMonthlyExpenses = prevMonthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const monthlyBalance = monthlyIncome - monthlyExpenses;
    const prevMonthlyBalance = prevMonthlyIncome - prevMonthlyExpenses;

    // Calcula variação percentual, evitando divisão por zero
    function percentChange(current: number, prev: number) {
      if (prev === 0 && current === 0) return 0;
      if (prev === 0) return 100;
      return ((current - prev) / Math.abs(prev)) * 100;
    }

    // Saldo total do mês anterior
    const prevTotalIncome = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() <= prevMonth && d.getFullYear() <= prevMonthYear && t.type === 'income';
    }).reduce((sum, t) => sum + t.amount, 0);
    const prevTotalExpenses = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() <= prevMonth && d.getFullYear() <= prevMonthYear && t.type === 'expense';
    }).reduce((sum, t) => sum + t.amount, 0);
    const prevTotalBalance = prevTotalIncome - prevTotalExpenses;

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance,
      monthlyIncomeChange: percentChange(monthlyIncome, prevMonthlyIncome),
      monthlyExpensesChange: percentChange(monthlyExpenses, prevMonthlyExpenses),
      monthlyBalanceChange: percentChange(monthlyBalance, prevMonthlyBalance),
      totalBalanceChange: percentChange(totalBalance, prevTotalBalance),
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden">
      {/* Animated background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            background: 'var(--gradient-mesh)'
          }}
        />
      </div>
      
      <div className="relative z-10 container mx-auto p-6 space-y-12">
        {/* Premium Header */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Sistema Premium de Controle Financeiro</span>
          </div>
          
          <h1 className="text-6xl font-bold font-playfair gradient-text animate-fade-in-up" 
              style={{ animationDelay: '0.2s' }}>
            Controle Financeiro
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-inter"
             style={{ animationDelay: '0.4s' }}>
            Transforme sua relação com o dinheiro através de uma gestão financeira inteligente, 
            visual e completamente personalizada para seus objetivos.
          </p>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div style={{ animationDelay: '0.1s' }}>
            <StatsCard
              title="💰 Saldo Total"
              value={`R$ ${financialSummary.totalBalance.toFixed(2)}`}
              icon={Wallet}
              type="balance"
              trend={{
                value: Math.abs(financialSummary.totalBalanceChange),
                isPositive: financialSummary.totalBalanceChange >= 0
              }}
            />
          </div>
          
          <div style={{ animationDelay: '0.2s' }}>
            <StatsCard
              title="📈 Receitas do Mês"
              value={`R$ ${financialSummary.monthlyIncome.toFixed(2)}`}
              icon={TrendingUp}
              type="income"
              trend={{
                value: Math.abs(financialSummary.monthlyIncomeChange),
                isPositive: financialSummary.monthlyIncomeChange >= 0
              }}
            />
          </div>
          <div style={{ animationDelay: '0.3s' }}>
            <StatsCard
              title="📉 Gastos do Mês"
              value={`R$ ${financialSummary.monthlyExpenses.toFixed(2)}`}
              icon={TrendingDown}
              type="expense"
              trend={{
                value: Math.abs(financialSummary.monthlyExpensesChange),
                isPositive: financialSummary.monthlyExpensesChange < 0 // Gastos positivos = ruim
              }}
            />
          </div>
          <div style={{ animationDelay: '0.4s' }}>
            <StatsCard
              title="🎯 Economia Mensal"
              value={`R$ ${financialSummary.monthlyBalance.toFixed(2)}`}
              icon={DollarSign}
              type={financialSummary.monthlyBalance >= 0 ? 'income' : 'expense'}
              trend={{
                value: Math.abs(financialSummary.monthlyBalanceChange),
                isPositive: financialSummary.monthlyBalanceChange >= 0
              }}
            />
          </div>
        </div>


        {/* Novos recursos premium com layout de card preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Orçamentos & Metas */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-neutral/10 backdrop-blur-xl card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-playfair font-semibold text-lg">Orçamentos & Metas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Defina limites por categoria e acompanhe o progresso das suas metas financeiras.
            </p>
            <BudgetsGoals budgets={budgets} onSetBudget={handleSetBudget} progress={budgetProgress} />
          </div>
          {/* Relatórios Avançados */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-income/10 to-primary/10 backdrop-blur-xl card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-income text-income-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-playfair font-semibold text-lg">Relatórios Avançados</h3>
            </div>
           
            <AdvancedReports monthlyData={advancedReportsData} />
          </div>
          {/* Alertas Inteligentes */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-expense/10 to-neutral/10 backdrop-blur-xl card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-expense text-expense-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-playfair font-semibold text-lg">Alertas Inteligentes</h3>
            </div>
            
            <SmartAlerts alerts={alerts} budgets={budgets} budgetProgress={budgetProgress} transactions={transactions} />
          </div>
        </div>

        {/* Main Content Grid com formulário, gráfico e histórico */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="xl:col-span-2 space-y-8">
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <AddTransactionForm
                onAddTransaction={handleAddTransaction}
                initialValues={editingTransaction || undefined}
                key={editingTransaction ? editingTransaction.id : 'new'}
              />
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <ExpenseChart transactions={transactions} />
            </div>
          </div>

          {/* Right Column - Transaction List */}
          <div className="xl:col-span-3 animate-slide-up" style={{ animationDelay: '1s' }}>
            <TransactionList 
              transactions={transactions} 
              title="💎 Histórico Premium de Transações"
              limit={12}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>



        {/* Premium Footer */}
        <div className="text-center py-12 border-t border-border/30 animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary/10 backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary font-playfair">
                Sistema Completo de Controle Financeiro
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              ✨ Versão 1.0 Premium - Desenvolvido com tecnologias de ponta para sua experiência financeira
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;