import { useState, useMemo } from "react";
import { Transaction, FinancialSummary } from "@/types/finance";
import { StatsCard } from "@/components/StatsCard";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

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

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const financialSummary: FinancialSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    // Current month calculations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyBalance = monthlyIncome - monthlyExpenses;

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Controle Financeiro
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie suas finanças de forma inteligente e tome controle do seu dinheiro
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Saldo Total"
            value={`R$ ${financialSummary.totalBalance.toFixed(2)}`}
            icon={Wallet}
            type="balance"
            trend={{
              value: 15.2,
              isPositive: financialSummary.monthlyBalance > 0
            }}
          />
          <StatsCard
            title="Receitas do Mês"
            value={`R$ ${financialSummary.monthlyIncome.toFixed(2)}`}
            icon={TrendingUp}
            type="income"
            trend={{
              value: 8.5,
              isPositive: true
            }}
          />
          <StatsCard
            title="Gastos do Mês"
            value={`R$ ${financialSummary.monthlyExpenses.toFixed(2)}`}
            icon={TrendingDown}
            type="expense"
            trend={{
              value: -12.3,
              isPositive: false
            }}
          />
          <StatsCard
            title="Economia Mensal"
            value={`R$ ${financialSummary.monthlyBalance.toFixed(2)}`}
            icon={DollarSign}
            type={financialSummary.monthlyBalance >= 0 ? 'income' : 'expense'}
            trend={{
              value: 23.1,
              isPositive: financialSummary.monthlyBalance > 0
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="lg:col-span-1 space-y-6">
            <AddTransactionForm onAddTransaction={handleAddTransaction} />
            <ExpenseChart transactions={transactions} />
          </div>

          {/* Right Column - Transaction List */}
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={transactions} 
              title="Histórico de Transações"
              limit={10}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            🚀 Sistema completo de controle financeiro - Versão 1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;