import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#0b0d12", surface: "#13151e", surface2: "#1a1d28", border: "#252836",
  text: "#e2e4ed", muted: "#5c6070", accent: "#5b8def", green: "#20c68a",
  red: "#f05f6e", amber: "#f0a830", purple: "#9b7fe8", cyan: "#22d3ee",
  cardBg: "#13151e",
};
const LIGHT = {
  bg: "#eef0f6", surface: "#ffffff", surface2: "#e8ebf4", border: "#d2d6e8",
  text: "#0f1120", muted: "#6b7080", accent: "#3d72e0", green: "#15a86e",
  red: "#d94455", amber: "#c8841a", purple: "#7c5fd4", cyan: "#0891b2",
  cardBg: "#ffffff",
};

const CAT_COLORS = {
  Food: "#20c68a", Transport: "#5b8def", Housing: "#f0a830",
  Entertainment: "#9b7fe8", Health: "#f05f6e", Shopping: "#22d3ee",
  Salary: "#20c68a", Freelance: "#34d399", Investment: "#6366f1", Other: "#8892a0",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const SEED_TRANSACTIONS = [
  {id:1,desc:"Monthly Salary",amount:5200,type:"income",cat:"Salary",date:"2025-01-05"},
  {id:2,desc:"Apartment Rent",amount:1400,type:"expense",cat:"Housing",date:"2025-01-07"},
  {id:3,desc:"Grocery Store",amount:210,type:"expense",cat:"Food",date:"2025-01-10"},
  {id:4,desc:"Netflix & Spotify",amount:28,type:"expense",cat:"Entertainment",date:"2025-01-14"},
  {id:5,desc:"Freelance Project",amount:800,type:"income",cat:"Freelance",date:"2025-01-18"},
  {id:6,desc:"Gym Membership",amount:45,type:"expense",cat:"Health",date:"2025-01-20"},
  {id:7,desc:"Uber Rides",amount:78,type:"expense",cat:"Transport",date:"2025-01-22"},
  {id:8,desc:"Monthly Salary",amount:5200,type:"income",cat:"Salary",date:"2025-02-05"},
  {id:9,desc:"Apartment Rent",amount:1400,type:"expense",cat:"Housing",date:"2025-02-07"},
  {id:10,desc:"Grocery Store",amount:195,type:"expense",cat:"Food",date:"2025-02-12"},
  {id:11,desc:"Online Shopping",amount:340,type:"expense",cat:"Shopping",date:"2025-02-15"},
  {id:12,desc:"Freelance Project",amount:1200,type:"income",cat:"Freelance",date:"2025-02-20"},
  {id:13,desc:"Monthly Salary",amount:5200,type:"income",cat:"Salary",date:"2025-03-05"},
  {id:14,desc:"Apartment Rent",amount:1400,type:"expense",cat:"Housing",date:"2025-03-07"},
  {id:15,desc:"Dental Visit",amount:180,type:"expense",cat:"Health",date:"2025-03-09"},
  {id:16,desc:"Grocery Store",amount:230,type:"expense",cat:"Food",date:"2025-03-14"},
  {id:17,desc:"Investment Dividend",amount:320,type:"income",cat:"Investment",date:"2025-03-18"},
  {id:18,desc:"Amazon Shopping",amount:275,type:"expense",cat:"Shopping",date:"2025-03-22"},
  {id:19,desc:"Monthly Salary",amount:5200,type:"income",cat:"Salary",date:"2025-04-05"},
  {id:20,desc:"Apartment Rent",amount:1400,type:"expense",cat:"Housing",date:"2025-04-07"},
  {id:21,desc:"Grocery Store",amount:215,type:"expense",cat:"Food",date:"2025-04-11"},
  {id:22,desc:"Concert Tickets",amount:120,type:"expense",cat:"Entertainment",date:"2025-04-15"},
  {id:23,desc:"Freelance Project",amount:950,type:"income",cat:"Freelance",date:"2025-04-20"},
  {id:24,desc:"Monthly Salary",amount:5200,type:"income",cat:"Salary",date:"2025-05-05"},
  {id:25,desc:"Apartment Rent",amount:1400,type:"expense",cat:"Housing",date:"2025-05-07"},
  {id:26,desc:"Grocery Store",amount:245,type:"expense",cat:"Food",date:"2025-05-10"},
  {id:27,desc:"Flight Tickets",amount:480,type:"expense",cat:"Transport",date:"2025-05-14"},
  {id:28,desc:"Investment Dividend",amount:320,type:"income",cat:"Investment",date:"2025-05-18"},
  {id:29,desc:"Monthly Salary",amount:5200,type:"income",cat:"Salary",date:"2025-06-05"},
  {id:30,desc:"Apartment Rent",amount:1400,type:"expense",cat:"Housing",date:"2025-06-07"},
  {id:31,desc:"Grocery Store",amount:200,type:"expense",cat:"Food",date:"2025-06-12"},
  {id:32,desc:"Online Course",amount:99,type:"expense",cat:"Other",date:"2025-06-18"},
  {id:33,desc:"Freelance Project",amount:1500,type:"income",cat:"Freelance",date:"2025-06-22"},
];

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("fin-dark") !== "false"; } catch { return true; }
  });
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem("fin-role") || "admin"; } catch { return "admin"; }
  });
  const [transactions, setTransactions] = useState(() => {
    try {
      const s = localStorage.getItem("fin-transactions");
      return s ? JSON.parse(s) : SEED_TRANSACTIONS;
    } catch { return SEED_TRANSACTIONS; }
  });
  const [filters, setFilters] = useState({ search: "", type: "", cat: "", dateFrom: "", dateTo: "", sort: "date-desc" });
  const [activeTab, setActiveTab] = useState("overview");
  const [nextId, setNextId] = useState(100);

  const theme = dark ? DARK : LIGHT;

  useEffect(() => {
    try { localStorage.setItem("fin-transactions", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  useEffect(() => {
    try { localStorage.setItem("fin-dark", String(dark)); } catch {}
  }, [dark]);

  useEffect(() => {
    try { localStorage.setItem("fin-role", role); } catch {}
  }, [role]);

  const addTransaction = useCallback((tx) => {
    setTransactions(prev => [...prev, { ...tx, id: nextId }]);
    setNextId(n => n + 1);
  }, [nextId]);

  const editTransaction = useCallback((id, tx) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...tx } : t));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const exportCSV = useCallback(() => {
    const rows = [["Date","Description","Category","Type","Amount"],
      ...transactions.map(t => [t.date, t.desc, t.cat, t.type, t.amount])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  }, [transactions]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.json";
    a.click();
  }, [transactions]);

  return (
    <AppContext.Provider value={{
      dark, setDark, theme, role, setRole,
      transactions, filters, setFilters,
      activeTab, setActiveTab,
      addTransaction, editTransaction, deleteTransaction,
      exportCSV, exportJSON,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (v) => "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function useStats(transactions) {
  return useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const balance = income - expense;
    const catMap = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      catMap[t.cat] = (catMap[t.cat] || 0) + t.amount;
    });
    const monthly = {};
    transactions.forEach(t => {
      const m = new Date(t.date).getMonth();
      if (!monthly[m]) monthly[m] = { income: 0, expense: 0 };
      if (t.type === "income") monthly[m].income += t.amount;
      else monthly[m].expense += t.amount;
    });
    const monthlyArr = Object.entries(monthly).sort((a, b) => a[0] - b[0]).map(([m, v]) => ({
      month: MONTHS[m], income: v.income, expense: v.expense, net: v.income - v.expense,
    }));
    let running = 0;
    const trendArr = monthlyArr.map(m => ({ month: m.month, balance: (running += m.net) }));
    const catArr = Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
    const topCat = catArr[0] || { name: "N/A", value: 0 };
    const months = monthlyArr.length;
    const avgExpense = months ? expense / months : 0;
    const savingsRate = income > 0 ? Math.round((income - expense) / income * 100) : 0;
    const lastM = monthlyArr[monthlyArr.length - 1];
    const prevM = monthlyArr[monthlyArr.length - 2];
    const incomeChg = prevM ? Math.round((lastM.income - prevM.income) / (prevM.income || 1) * 100) : 0;
    const expenseChg = prevM ? Math.round((lastM.expense - prevM.expense) / (prevM.expense || 1) * 100) : 0;
    return { income, expense, balance, catArr, monthlyArr, trendArr, topCat, avgExpense, savingsRate, incomeChg, expenseChg, months };
  }, [transactions]);
}

// ─── TRANSACTION MODAL ────────────────────────────────────────────────────────
const BLANK = { desc: "", amount: "", type: "expense", cat: "Food", date: new Date().toISOString().split("T")[0] };

function TxModal({ open, onClose, initial, onSave }) {
  const { theme } = useApp();
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const isEdit = !!initial;

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial, amount: String(initial.amount) } : { ...BLANK, date: new Date().toISOString().split("T")[0] });
      setError("");
    }
  }, [open, initial]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.desc.trim()) return setError("Description is required");
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return setError("Enter a valid positive amount");
    if (!form.date) return setError("Date is required");
    onSave({ desc: form.desc.trim(), amount: amt, type: form.type, cat: form.cat, date: form.date });
    onClose();
  };

  if (!open) return null;

  const s = {
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
    box: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "28px", width: "440px", maxWidth: "100%", animation: "fadeUp 0.2s ease" },
    label: { fontSize: "11px", fontWeight: 600, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: "6px" },
    input: { width: "100%", background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text, padding: "9px 13px", borderRadius: "8px", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    row: { marginBottom: "14px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.box}>
        <h3 style={{ fontSize: "17px", fontWeight: 700, color: theme.text, marginBottom: "22px" }}>
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </h3>
        <div style={s.row}>
          <label style={s.label}>Description</label>
          <input style={s.input} value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="e.g. Grocery run" />
        </div>
        <div style={s.grid}>
          <div style={s.row}>
            <label style={s.label}>Amount ($)</label>
            <input style={s.input} type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0" min="0" />
          </div>
          <div style={s.row}>
            <label style={s.label}>Type</label>
            <select style={s.input} value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <div style={s.grid}>
          <div style={s.row}>
            <label style={s.label}>Category</label>
            <select style={s.input} value={form.cat} onChange={e => set("cat", e.target.value)}>
              {Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={s.row}>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          </div>
        </div>
        {error && <div style={{ color: theme.red, fontSize: "12px", marginBottom: "12px" }}>⚠ {error}</div>}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
          <button onClick={onClose} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text, padding: "8px 20px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={save} style={{ background: theme.accent, color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {isEdit ? "Save Changes" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, change, changeLabel, color, icon }) {
  const { theme } = useApp();
  const isPos = change >= 0;
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "16px", top: "16px", fontSize: "22px", opacity: 0.15 }}>{icon}</div>
      <div style={{ fontSize: "11px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.9px", marginBottom: "10px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, color: color || theme.text, fontFamily: "'DM Mono', monospace", letterSpacing: "-1px" }}>{value}</div>
      {changeLabel && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: change !== undefined ? (isPos ? theme.green : theme.red) : theme.muted }}>
          {change !== undefined && (isPos ? "▲ " : "▼ ")}{changeLabel}
        </div>
      )}
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { theme, transactions } = useApp();
  const stats = useStats(transactions);
  const recent = useMemo(() => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6), [transactions]);

  const pieData = stats.catArr.slice(0, 6);

  return (
    <div>
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <MetricCard label="Total Balance" value={fmt(stats.balance)} change={stats.balance} changeLabel={stats.balance >= 0 ? "Positive balance" : "Negative balance"} color={stats.balance >= 0 ? theme.green : theme.red} icon="💰" />
        <MetricCard label="Total Income" value={fmt(stats.income)} changeLabel={`Across ${stats.months} months`} color={theme.green} icon="📈" />
        <MetricCard label="Total Expenses" value={fmt(stats.expense)} changeLabel={`${stats.catArr.length} categories`} color={theme.red} icon="📉" />
        <MetricCard label="Savings Rate" value={`${stats.savingsRate}%`} change={stats.savingsRate - 20} changeLabel={stats.savingsRate >= 20 ? "Above 20% target" : "Below 20% target"} color={stats.savingsRate >= 20 ? theme.green : theme.amber} icon="🎯" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Balance trend</div>
          {stats.trendArr.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.trendArr}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="month" tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
                <Tooltip formatter={v => [fmt(v), "Balance"]} contentStyle={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
                <Line type="monotone" dataKey="balance" stroke={theme.accent} strokeWidth={2.5} dot={{ r: 4, fill: theme.accent }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <EmptyChart theme={theme} />}
        </div>
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Spending by category</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={CAT_COLORS[entry.name] || "#888"} />)}
                  </Pie>
                  <Tooltip formatter={v => [fmt(v)]} contentStyle={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: CAT_COLORS[d.name] || "#888", flexShrink: 0 }} />
                      <span style={{ color: theme.muted }}>{d.name}</span>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: theme.text }}>{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <EmptyChart theme={theme} />}
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Recent transactions</div>
        {recent.length > 0 ? (
          <TxTable rows={recent} compact />
        ) : <EmptyState label="No transactions yet" />}
      </div>
    </div>
  );
}

function EmptyChart({ theme }) {
  return <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: theme.muted, fontSize: "13px" }}>No data yet</div>;
}

// ─── TX TABLE ─────────────────────────────────────────────────────────────────
function TxTable({ rows, compact }) {
  const { theme, role, editTransaction, deleteTransaction } = useApp();
  const [editTarget, setEditTarget] = useState(null);
  const isAdmin = role === "admin";

  const colStyle = { padding: compact ? "9px 10px" : "11px 14px", borderBottom: `1px solid ${theme.border}`, fontSize: "13px", color: theme.text, background: "transparent" };
  const headStyle = { ...colStyle, fontSize: "11px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.7px" };

  return (
    <>
      <TxModal
        open={!!editTarget}
        initial={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(data) => editTransaction(editTarget.id, data)}
      />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
          <thead>
            <tr>
              <th style={headStyle}>Date</th>
              <th style={headStyle}>Description</th>
              <th style={headStyle}>Category</th>
              <th style={headStyle}>Type</th>
              <th style={{ ...headStyle, textAlign: "right" }}>Amount</th>
              {isAdmin && !compact && <th style={{ ...headStyle, textAlign: "center" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(t => (
              <tr key={t.id} style={{ transition: "background 0.15s" }}
                onMouseEnter={e => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = theme.surface2); }}
                onMouseLeave={e => { Array.from(e.currentTarget.cells).forEach(c => c.style.background = "transparent"); }}>
                <td style={{ ...colStyle, fontFamily: "'DM Mono', monospace", fontSize: "12px", color: theme.muted }}>{t.date}</td>
                <td style={{ ...colStyle, fontWeight: 500 }}>{t.desc}</td>
                <td style={colStyle}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: CAT_COLORS[t.cat] || "#888", flexShrink: 0 }} />
                    {t.cat}
                  </span>
                </td>
                <td style={colStyle}>
                  <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: t.type === "income" ? "rgba(32,198,138,0.15)" : "rgba(240,95,110,0.15)", color: t.type === "income" ? theme.green : theme.red }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ ...colStyle, textAlign: "right", fontFamily: "'DM Mono', monospace", fontWeight: 700, color: t.type === "income" ? theme.green : theme.red }}>
                  {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                </td>
                {isAdmin && !compact && (
                  <td style={{ ...colStyle, textAlign: "center" }}>
                    <span style={{ display: "inline-flex", gap: "6px" }}>
                      <button onClick={() => setEditTarget(t)} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.accent, padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                      <button onClick={() => deleteTransaction(t.id)} style={{ background: "rgba(240,95,110,0.1)", border: "1px solid rgba(240,95,110,0.25)", color: theme.red, padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── TRANSACTIONS TAB ────────────────────────────────────────────────────────
function TransactionsTab() {
  const { theme, role, transactions, filters, setFilters, addTransaction, exportCSV, exportJSON } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const isAdmin = role === "admin";

  const allCats = useMemo(() => [...new Set(transactions.map(t => t.cat))].sort(), [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.search) list = list.filter(t => t.desc.toLowerCase().includes(filters.search.toLowerCase()) || t.cat.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.type) list = list.filter(t => t.type === filters.type);
    if (filters.cat) list = list.filter(t => t.cat === filters.cat);
    if (filters.dateFrom) list = list.filter(t => t.date >= filters.dateFrom);
    if (filters.dateTo) list = list.filter(t => t.date <= filters.dateTo);
    if (filters.sort === "date-desc") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (filters.sort === "date-asc") list.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (filters.sort === "amount-desc") list.sort((a, b) => b.amount - a.amount);
    else if (filters.sort === "amount-asc") list.sort((a, b) => a.amount - b.amount);
    return list;
  }, [transactions, filters]);

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const clearFilters = () => setFilters({ search: "", type: "", cat: "", dateFrom: "", dateTo: "", sort: "date-desc" });
  const hasActiveFilters = filters.search || filters.type || filters.cat || filters.dateFrom || filters.dateTo;

  const inStyle = { background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text, padding: "8px 13px", borderRadius: "8px", fontSize: "13px", fontFamily: "inherit", outline: "none" };

  return (
    <div>
      <TxModal open={addOpen} onClose={() => setAddOpen(false)} onSave={addTransaction} />

      {/* Filter Bar */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input style={{ ...inStyle, flex: "1", minWidth: "160px" }} placeholder="Search transactions..." value={filters.search} onChange={e => setF("search", e.target.value)} />
          <select style={inStyle} value={filters.type} onChange={e => setF("type", e.target.value)}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select style={inStyle} value={filters.cat} onChange={e => setF("cat", e.target.value)}>
            <option value="">All categories</option>
            {allCats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input style={inStyle} type="date" value={filters.dateFrom} onChange={e => setF("dateFrom", e.target.value)} title="From date" />
          <input style={inStyle} type="date" value={filters.dateTo} onChange={e => setF("dateTo", e.target.value)} title="To date" />
          <select style={inStyle} value={filters.sort} onChange={e => setF("sort", e.target.value)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
          {hasActiveFilters && (
            <button onClick={clearFilters} style={{ ...inStyle, color: theme.red, cursor: "pointer", border: `1px solid rgba(240,95,110,0.3)` }}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Actions Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "13px", color: theme.muted }}>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={exportCSV} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text, padding: "7px 14px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>↓ Export CSV</button>
          <button onClick={exportJSON} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text, padding: "7px 14px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>↓ Export JSON</button>
          {isAdmin && (
            <button onClick={() => setAddOpen(true)} style={{ background: theme.accent, color: "#fff", border: "none", padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Add Transaction</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", overflow: "hidden" }}>
        {filtered.length > 0 ? (
          <TxTable rows={filtered} />
        ) : <EmptyState label={hasActiveFilters ? "No transactions match your filters" : "No transactions yet"} sub={hasActiveFilters ? "Try adjusting or clearing your filters" : isAdmin ? "Click '+ Add Transaction' to get started" : ""} />}
      </div>
    </div>
  );
}

// ─── INSIGHTS TAB ─────────────────────────────────────────────────────────────
function InsightsTab() {
  const { theme, transactions } = useApp();
  const stats = useStats(transactions);

  const lastM = stats.monthlyArr[stats.monthlyArr.length - 1];
  const prevM = stats.monthlyArr[stats.monthlyArr.length - 2];
  const totalExpenses = stats.catArr.reduce((s, c) => s + c.value, 0);

  return (
    <div>
      {/* Insight Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <InsightCard theme={theme} title="Savings rate" value={`${stats.savingsRate}%`} sub={stats.savingsRate >= 20 ? "On track — great discipline" : "Below 20% target"} accent={stats.savingsRate >= 20 ? theme.green : theme.amber} />
        <InsightCard theme={theme} title="Top spending category" value={stats.topCat.name} sub={`${fmt(stats.topCat.value)} total`} accent={CAT_COLORS[stats.topCat.name] || theme.accent} />
        <InsightCard theme={theme} title="Avg monthly expense" value={fmt(stats.avgExpense)} sub={`Over ${stats.months} months`} accent={theme.red} />
        <InsightCard theme={theme} title="Net savings" value={fmt(stats.balance)} sub={stats.balance >= 0 ? "Surplus" : "Deficit"} accent={stats.balance >= 0 ? theme.green : theme.red} />
        {lastM && <InsightCard theme={theme} title={`${lastM.month} income`} value={fmt(lastM.income)} sub={prevM ? `${stats.incomeChg >= 0 ? "▲" : "▼"} ${Math.abs(stats.incomeChg)}% vs ${prevM.month}` : "Latest month"} accent={stats.incomeChg >= 0 ? theme.green : theme.red} />}
        {lastM && <InsightCard theme={theme} title={`${lastM.month} expenses`} value={fmt(lastM.expense)} sub={prevM ? `${stats.expenseChg >= 0 ? "▲" : "▼"} ${Math.abs(stats.expenseChg)}% vs ${prevM.month}` : "Latest month"} accent={stats.expenseChg <= 0 ? theme.green : theme.red} />}
      </div>

      {/* Monthly Comparison Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Monthly income vs expenses</div>
          {stats.monthlyArr.length > 0 ? (
            <>
              <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
                {[["Income", theme.green], ["Expenses", theme.red]].map(([l, c]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: theme.muted }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: c }} />{l}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.monthlyArr} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                  <XAxis dataKey="month" tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} />
                  <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "8px", color: theme.text }} />
                  <Bar dataKey="income" fill={theme.green} radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill={theme.red} radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : <EmptyChart theme={theme} />}
        </div>

        {/* Category Breakdown */}
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Category breakdown</div>
          {stats.catArr.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {stats.catArr.map((d) => (
                <div key={d.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: CAT_COLORS[d.name] || "#888" }} />
                      <span style={{ color: theme.text }}>{d.name}</span>
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: theme.muted, fontSize: "12px" }}>
                      {fmt(d.value)} <span style={{ opacity: 0.6 }}>({Math.round(d.value / totalExpenses * 100)}%)</span>
                    </span>
                  </div>
                  <div style={{ height: "5px", background: theme.border, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.round(d.value / totalExpenses * 100)}%`, background: CAT_COLORS[d.name] || "#888", borderRadius: "3px", transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState label="No expense data" />}
        </div>
      </div>

      {/* Monthly comparison table */}
      {prevM && lastM && (
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "14px", padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Month-over-month comparison</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { label: "Income", cur: lastM.income, prev: prevM.income, good: v => v >= 0 },
              { label: "Expenses", cur: lastM.expense, prev: prevM.expense, good: v => v <= 0 },
              { label: "Net Savings", cur: lastM.net, prev: prevM.net, good: v => v >= 0 },
            ].map(({ label, cur, prev, good }) => {
              const diff = cur - prev;
              const pct = prev ? Math.round(diff / prev * 100) : 0;
              const isGood = good(diff);
              return (
                <div key={label} style={{ background: theme.surface2, borderRadius: "10px", padding: "16px", borderLeft: `3px solid ${isGood ? theme.green : theme.red}` }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "8px" }}>{label}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: theme.muted }}>{prevM.month}</div>
                      <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: theme.text }}>{fmt(prev)}</div>
                    </div>
                    <div style={{ fontSize: "20px", color: theme.muted }}>→</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", color: theme.muted }}>{lastM.month}</div>
                      <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "'DM Mono', monospace", color: theme.text }}>{fmt(cur)}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: isGood ? theme.green : theme.red, fontWeight: 600 }}>
                    {diff >= 0 ? "▲" : "▼"} {fmt(Math.abs(diff))} ({Math.abs(pct)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ theme, title, value, sub, accent }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "18px", borderLeft: `3px solid ${accent}` }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "22px", fontWeight: 800, color: theme.text, fontFamily: "'DM Mono', monospace", letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: theme.muted, marginTop: "5px" }}>{sub}</div>
    </div>
  );
}

function EmptyState({ label, sub }) {
  const { theme } = useApp();
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px", opacity: 0.4 }}>📭</div>
      <div style={{ color: theme.muted, fontSize: "14px", fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ color: theme.muted, fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>{sub}</div>}
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const TABS = ["overview", "transactions", "insights"];

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

function Shell() {
  const { theme, dark, setDark, role, setRole, activeTab, setActiveTab } = useApp();

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'Syne', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${theme.bg}; }
        select option { background: ${theme.surface}; color: ${theme.text}; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: ${dark ? "invert(1)" : "none"}; opacity: 0.5; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
      `}</style>

      {/* Topbar */}
      <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "18px", fontWeight: 800, color: theme.accent, letterSpacing: "-0.5px" }}>Zorv<span style={{ color: theme.text }}>fin</span></div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.8px", opacity: 0.6 }}>Finance Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "6px 12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: theme.muted, textTransform: "uppercase", letterSpacing: "0.6px" }}>Role</span>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ background: "transparent", border: "none", color: role === "admin" ? theme.accent : theme.purple, fontSize: "13px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button onClick={() => setDark(d => !d)} style={{ background: theme.surface2, border: `1px solid ${theme.border}`, color: theme.text, padding: "7px 14px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            {dark ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </div>

      {/* Role Banner */}
      <div style={{ background: role === "admin" ? `rgba(91,141,239,0.08)` : `rgba(155,127,232,0.08)`, borderBottom: `1px solid ${role === "admin" ? "rgba(91,141,239,0.2)" : "rgba(155,127,232,0.2)"}`, padding: "8px 24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
        <span style={{ fontWeight: 700, color: role === "admin" ? theme.accent : theme.purple }}>{role === "admin" ? "Admin" : "Viewer"} mode</span>
        <span style={{ color: theme.muted }}>{role === "admin" ? "You can add, edit, and delete transactions." : "Read-only access. Switch to Admin to make changes."}</span>
      </div>

      {/* Nav Tabs */}
      <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, padding: "0 24px", display: "flex", gap: "2px", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "13px 18px", fontSize: "13px", fontWeight: 600, color: activeTab === t ? theme.accent : theme.muted, background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === t ? theme.accent : "transparent"}`, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", transition: "color 0.2s, border-color 0.2s", whiteSpace: "nowrap" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "transactions" && <TransactionsTab />}
        {activeTab === "insights" && <InsightsTab />}
      </div>
    </div>
  );
}
