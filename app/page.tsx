'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Database, Filter, RefreshCw, Layers, PlusCircle, 
  TrendingUp, ShoppingBag, DollarSign, Package, Code2, ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

interface SaleRecord {
  id: string;
  orderId: string;
  customerId: string;
  orderDate: string;
  category: string;
  region: string;
  paymentMethod: string;
  quantity: number;
  unitPrice: number;
  totalSales: number;
  discount: number;
}

export default function Dashboard() {
  const [data, setData] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  
  // GroupBy Playground States
  const [groupByKey, setGroupByKey] = useState<'category' | 'region' | 'paymentMethod'>('category');
  const [targetMetric, setTargetMetric] = useState<'totalSales' | 'quantity'>('totalSales');
  const [aggFunc, setAggFunc] = useState<'SUM' | 'MEAN' | 'COUNT'>('SUM');

  // New Record Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSale, setNewSale] = useState({
    category: 'Electronics',
    region: 'North',
    paymentMethod: 'UPI',
    quantity: 1,
    unitPrice: 5000,
    discount: 0.1
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sales');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchSales();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchReg = selectedRegion === 'All' || item.region === selectedRegion;
      return matchCat && matchReg;
    });
  }, [data, selectedCategory, selectedRegion]);

  // Dynamic GroupBy & Aggregation Logic
  const aggregatedData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const groups: Record<string, number[]> = {};
    filteredData.forEach(item => {
      const groupVal = item[groupByKey];
      const val = item[targetMetric];
      if (!groups[groupVal]) groups[groupVal] = [];
      groups[groupVal].push(val);
    });

    return Object.entries(groups).map(([key, values]) => {
      let result = 0;
      if (aggFunc === 'SUM') result = values.reduce((a, b) => a + b, 0);
      else if (aggFunc === 'MEAN') result = values.reduce((a, b) => a + b, 0) / values.length;
      else if (aggFunc === 'COUNT') result = values.length;

      return {
        group: key,
        value: Number(result.toFixed(2)),
        count: values.length
      };
    });
  }, [filteredData, groupByKey, targetMetric, aggFunc]);

  // KPI Metrics
  const totalRevenue = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.totalSales, 0), [filteredData]);
  const totalOrders = filteredData.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalUnits = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.quantity, 0), [filteredData]);

  // Python Code Snippet Generator
  const pythonCode = `import pandas as pd

# Query data from SQLite backend
df = pd.read_sql("SELECT * FROM Sale", con=engine)

# Filter logic
${selectedCategory !== 'All' ? `df = df[df['category'] == '${selectedCategory}']
` : ''}${selectedRegion !== 'All' ? `df = df[df['region'] == '${selectedRegion}']
` : ''}
# Client Aggregation
result = df.groupby('${groupByKey}')['${targetMetric}'].agg(['${aggFunc.toLowerCase()}']).reset_index()
print(result)`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8 font-sans">
      {/* Top Navbar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Online Shopping Sales Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Group & Aggregation Explorer with Live SQLite Database Backend (Prisma ORM)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-3.5 h-3.5" /> SQLite Active (dev.db)
          </span>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Record
          </button>
        </div>
      </header>

      {/* Global Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between backdrop-blur">
        <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
          <Filter className="w-4 h-4 text-indigo-400" /> Filter Dataset:
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs text-slate-400 mr-2">Category:</label>
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mr-2">Region:</label>
            <select 
              value={selectedRegion} 
              onChange={e => setSelectedRegion(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-1.5 outline-none focus:border-indigo-500"
            >
              <option value="All">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider font-semibold">
            Total Revenue
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">₹{totalRevenue.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider font-semibold">
            Total Orders
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{totalOrders}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider font-semibold">
            Average Order Value
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">₹{avgOrderValue.toFixed(2)}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 backdrop-blur">
          <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-wider font-semibold">
            Total Units Sold
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{totalUnits}</div>
        </div>
      </div>

      {/* GroupBy & Aggregation Hero Playground */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Dynamic GroupBy & Aggregation Playground
            </h2>
            <p className="text-xs text-slate-400">Select parameters to execute client-side Pandas simulation on backend data.</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Group By</label>
              <select 
                value={groupByKey} 
                onChange={e => setGroupByKey(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-md px-3 py-1.5 text-slate-200"
              >
                <option value="category">Category</option>
                <option value="region">Region</option>
                <option value="paymentMethod">Payment Method</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Metric</label>
              <select 
                value={targetMetric} 
                onChange={e => setTargetMetric(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-md px-3 py-1.5 text-slate-200"
              >
                <option value="totalSales">Total Sales (₹)</option>
                <option value="quantity">Quantity</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Aggregation</label>
              <select 
                value={aggFunc} 
                onChange={e => setAggFunc(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-md px-3 py-1.5 text-slate-200"
              >
                <option value="SUM">SUM</option>
                <option value="MEAN">MEAN</option>
                <option value="COUNT">COUNT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Code Banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 flex items-start gap-3">
          <Code2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <pre className="overflow-x-auto whitespace-pre-wrap">{pythonCode}</pre>
        </div>

        {/* Visual & Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 h-72">
            <h3 className="text-xs font-semibold text-slate-400 mb-4 uppercase">Visual Output</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 overflow-x-auto">
            <h3 className="text-xs font-semibold text-slate-400 mb-4 uppercase">Tabular Output</h3>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="p-2 capitalize">{groupByKey}</th>
                  <th className="p-2">{aggFunc} of {targetMetric}</th>
                  <th className="p-2">Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {aggregatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2 font-medium text-slate-100">{row.group}</td>
                    <td className="p-2 text-indigo-400 font-semibold">{row.value.toLocaleString()}</td>
                    <td className="p-2 text-slate-400">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add New Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Add New Transaction to Database</h3>
            <form onSubmit={handleAddSale} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <select 
                  value={newSale.category}
                  onChange={e => setNewSale({...newSale, category: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-md p-2"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Region</label>
                <select 
                  value={newSale.region}
                  onChange={e => setNewSale({...newSale, region: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-md p-2"
                >
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                <input 
                  type="number"
                  min="1"
                  value={newSale.quantity}
                  onChange={e => setNewSale({...newSale, quantity: parseInt(e.target.value)})}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-md p-2"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit Price (₹)</label>
                <input 
                  type="number"
                  value={newSale.unitPrice}
                  onChange={e => setNewSale({...newSale, unitPrice: parseFloat(e.target.value)})}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-md p-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                >
                  Save to SQLite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
