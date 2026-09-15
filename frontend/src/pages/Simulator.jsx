import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../services/api';
import { Calculator, ArrowRight, Zap, Target } from 'lucide-react';

export default function Simulator() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');
  const [recommendations, setRecommendations] = useState([]);
  const [budget, setBudget] = useState(200000);

  useEffect(() => {
    if (!companyId) {
      navigate('/setup');
      return;
    }
    const fetchData = async () => {
      try {
        const res = await getRecommendations(companyId);
        setRecommendations(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [companyId, navigate]);

  // Fallback to sample data if AI hasn't been run or returned missing data
  const actions = recommendations.length > 0 && recommendations[0].investment ? recommendations : [
    { title: 'LED Upgrade', investment: 100000, annual_savings: 42000, co2_reduction: 12, roi: 42, payback_period: 28 },
    { title: 'HVAC Optimization', investment: 100000, annual_savings: 78000, co2_reduction: 19, roi: 78, payback_period: 15 },
    { title: 'Transport Optimization', investment: 100000, annual_savings: 55000, co2_reduction: 24, roi: 55, payback_period: 22 },
    { title: 'Solar', investment: 100000, annual_savings: 32000, co2_reduction: 30, roi: 32, payback_period: 38 },
  ];

  const formatINR = (val) => `₹${val.toLocaleString('en-IN')}`;
  
  // Calculate simulator output based on slider
  // We'll proportionally scale the best combination of actions based on budget
  // For MVP demo purposes, we create an aggregated multiplier
  const totalBaseInvestment = actions.reduce((acc, curr) => acc + curr.investment, 0);
  const investmentRatio = budget / (totalBaseInvestment || 1);
  
  const simSavings = actions.reduce((acc, curr) => acc + curr.annual_savings, 0) * (investmentRatio > 1 ? 1 : investmentRatio);
  const simCO2 = actions.reduce((acc, curr) => acc + curr.co2_reduction, 0) * (investmentRatio > 1 ? 1 : investmentRatio);
  const simROI = simSavings > 0 ? ((simSavings / budget) * 100) : 0;
  const simPayback = simSavings > 0 ? ((budget / simSavings) * 12) : 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Decarbonization Simulator</h1>
        <p className="mt-1 text-slate-500">Test investment scenarios to maximize ROI and CO₂ reduction.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Your ₹ → Your CO₂ Slider */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            Your ₹ → Your CO₂
          </h3>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Investment Budget: <span className="text-xl font-bold text-primary ml-2">{formatINR(budget)}</span>
            </label>
            <input 
              type="range" 
              min="10000" 
              max="1000000" 
              step="10000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>₹10,000</span>
              <span>₹10,00,000</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Estimated Outcomes</h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Potential Annual Savings</p>
                <p className="text-2xl font-bold text-green-600">{formatINR(Math.round(simSavings))}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">CO₂ Reduction</p>
                <p className="text-2xl font-bold text-slate-900">{simCO2.toFixed(1)} <span className="text-sm font-normal text-slate-500">tCO₂e</span></p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Average ROI</p>
                <p className="text-xl font-bold text-slate-900">{simROI.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Average Payback</p>
                <p className="text-xl font-bold text-slate-900">{simPayback.toFixed(1)} mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* 1 Lakh Comparison */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            What should we do with ₹1,00,000?
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Action</th>
                  <th className="px-4 py-3">Savings</th>
                  <th className="px-4 py-3">CO₂ (t)</th>
                  <th className="px-4 py-3">ROI</th>
                  <th className="px-4 py-3 rounded-tr-lg rounded-br-lg">Payback</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action, idx) => {
                  // Normalize to 1L
                  const ratio = 100000 / action.investment;
                  const savings = action.annual_savings * ratio;
                  const co2 = action.co2_reduction * ratio;
                  const payback = (100000 / savings) * 12;
                  
                  return (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{action.title}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">₹{(savings/1000).toFixed(1)}k</td>
                      <td className="px-4 py-3">{co2.toFixed(1)}</td>
                      <td className="px-4 py-3 font-medium">{action.roi}%</td>
                      <td className="px-4 py-3">{payback.toFixed(1)} mo</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
