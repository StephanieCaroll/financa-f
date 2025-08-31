import { useState, useMemo } from "react";
import { Transaction, FinancialSummary } from "@/types/finance";
import { StatsCard } from "@/components/StatsCard";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Sparkles, Target, BarChart3 } from "lucide-react";

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
                value: 15.2,
                isPositive: financialSummary.monthlyBalance > 0
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
                value: 8.5,
                isPositive: true
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
                value: 12.3,
                isPositive: false
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
                value: 23.1,
                isPositive: financialSummary.monthlyBalance > 0
              }}
            />
          </div>
        </div>

        {/* Main Content Grid with Premium Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="xl:col-span-2 space-y-8">
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <AddTransactionForm onAddTransaction={handleAddTransaction} />
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
            />
          </div>
        </div>

        {/* Premium Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-neutral/10 backdrop-blur-xl border border-primary/20 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-playfair font-semibold text-lg">Orçamentos & Metas</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Defina limites por categoria e acompanhe o progresso das suas metas financeiras.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-income/10 to-primary/10 backdrop-blur-xl border border-income/20 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-income text-income-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-playfair font-semibold text-lg">Relatórios Avançados</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Análises detalhadas com comparativos mensais e insights personalizados.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-expense/10 to-neutral/10 backdrop-blur-xl border border-expense/20 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-expense text-expense-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-playfair font-semibold text-lg">Alertas Inteligentes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Notificações automáticas quando você se aproxima dos limites de orçamento.
            </p>
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