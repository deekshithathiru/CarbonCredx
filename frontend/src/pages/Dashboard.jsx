import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmissions, getBenchmark, getRecommendations } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { Activity, Target, AlertCircle, IndianRupee, TrendingUp, Zap, PiggyBank, Briefcase, Leaf } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');
  const companyName = localStorage.getItem('companyName');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    if (!companyId) {
      navigate('/setup');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [emissionsRes, benchmarkRes, recsRes] = await Promise.all([
          getEmissions(companyId),
          getBenchmark(companyId),
          getRecommendations(companyId).catch(() => ({ data: [] }))
        ]);
        setData(emissionsRes.data);
        setBenchmark(benchmarkRes.data);
        setRecommendations(recsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-slate-500">No data available</div>;

  const { scope1, scope2, scope3, total, breakdown } = data;
  
  const formattedTotal = (total / 1000).toFixed(2);
  
  // Calculate dynamic financial metrics from AI recommendations
  let potentialAnnualSavings = 0;
  let co2ReductionPotential = 0;
  recommendations.forEach(r => {
    if (r.annual_savings) potentialAnnualSavings += r.annual_savings;
    if (r.co2_reduction) co2ReductionPotential += r.co2_reduction;
  });
  
  // Fallback to sample data if AI hasn't been run or values are zero
  if (potentialAnnualSavings === 0) {
    potentialAnnualSavings = 1120000;
  }
  if (co2ReductionPotential === 0) {
    co2ReductionPotential = 284;
  }
  
  const potentialOpportunities = 460000; // Mock from prompt
  const avoidedCosts = 260000; // Mock from prompt
  
  const totalFinancialValue = potentialAnnualSavings + potentialOpportunities + avoidedCosts;
  
  const formatINR = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const moneySavedData = [
    { name: 'Q1', savings: 150000 },
    { name: 'Q2', savings: 320000 },
    { name: 'Q3', savings: 510000 },
    { name: 'Q4', savings: 684200 },
  ];

  const categorySavingsData = [
    { name: 'Energy Opt', value: 520000 },
    { name: 'Renewable', value: 280000 },
    { name: 'Transport', value: 170000 },
    { name: 'Waste', value: 90000 },
    { name: 'Biz Travel', value: 60000 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{companyName} Dashboard</h1>
          <p className="mt-1 text-slate-500">Financial-first sustainability intelligence</p>
        </div>
      </div>

      {/* Hero Financial KPI */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 bg-gradient-to-br from-green-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Total Financial Value Identified</h3>
            </div>
            <div className="text-5xl font-black text-slate-900 mb-2">
              {formatINR(totalFinancialValue)}
            </div>
            <p className="text-lg text-green-700 font-medium flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              {co2ReductionPotential.toFixed(0)} tCO₂e reduction potential
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="bg-white/80 p-4 rounded-xl border border-green-100 flex items-center justify-between min-w-[250px]">
              <span className="text-sm font-medium text-slate-600">Potential Annual Savings</span>
              <span className="text-base font-bold text-slate-900">{formatINR(potentialAnnualSavings)}</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-green-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Potential Market Opps</span>
              <span className="text-base font-bold text-slate-900">{formatINR(potentialOpportunities)}</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-green-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Avoided Op Costs</span>
              <span className="text-base font-bold text-slate-900">{formatINR(avoidedCosts)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Money Saved This Year */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-primary" />
                Money Saved This Year
              </h3>
              <div className="text-3xl font-bold text-slate-900 mt-2">₹6,84,200</div>
              <p className="text-sm text-green-600 font-medium mt-1">+14% vs last year</p>
            </div>
            <select className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
              <option>Yearly</option>
              <option>Quarterly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moneySavedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Line type="monotone" dataKey="savings" stroke="#16a34a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Where Are You Saving Money */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Where Are You Saving Money?
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySavingsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" tickFormatter={(val) => `₹${val/1000}k`} />
                <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 12}} />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Top Money-Saving Actions
        </h3>
        
        <div className="space-y-4">
          {recommendations.length > 0 ? recommendations.map((rec, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-primary/30 transition-colors bg-slate-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400">0{idx + 1}</span>
                  <h4 className="font-bold text-slate-900">{rec.title}</h4>
                  {rec.roi > 80 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Best ROI</span>
                  )}
                  {rec.payback_period < 12 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Fastest Payback</span>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  Reduces {rec.co2_reduction} tCO₂e • {rec.difficulty} difficulty
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6 mt-4 sm:mt-0 items-center justify-end text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Investment</span>
                  <span className="font-semibold text-slate-900">{formatINR(rec.investment)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Annual Savings</span>
                  <span className="font-semibold text-green-600">{formatINR(rec.annual_savings)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">ROI</span>
                  <span className="font-semibold text-slate-900">{rec.roi}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Payback</span>
                  <span className="font-semibold text-slate-900">{rec.payback_period} mo</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl">
              Go to AI Actions to generate your financial sustainability recommendations.
            </div>
          )}
        </div>
      </div>
      
      {/* Carbon Footprint Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Current Carbon Profile</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Emissions</p>
            <p className="text-2xl font-bold text-slate-900">{formattedTotal} <span className="text-sm font-normal">tCO₂e</span></p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Scope 1</p>
            <p className="text-2xl font-bold text-slate-900">{(scope1/1000).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Scope 2</p>
            <p className="text-2xl font-bold text-slate-900">{(scope2/1000).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Scope 3</p>
            <p className="text-2xl font-bold text-slate-900">{(scope3/1000).toFixed(1)}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
