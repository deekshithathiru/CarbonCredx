import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, generateRecommendations } from '../services/api';
import { Lightbulb, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function Recommendations() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    if (!companyId) {
      navigate('/setup');
      return;
    }
    
    fetchRecommendations();
  }, [companyId, navigate]);

  const fetchRecommendations = async () => {
    try {
      const res = await getRecommendations(companyId);
      if (res.data && res.data.length > 0) {
        setRecommendations(res.data);
      } else {
        // If none exist, auto-generate them
        await handleGenerate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateRecommendations(companyId);
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading || generating) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500">{generating ? 'Generating your AI action plan...' : 'Loading recommendations...'}</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch(priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            AI Action Center
          </h1>
          <p className="mt-2 text-slate-600">Your highest-impact opportunities to reduce emissions.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Zap className="w-4 h-4 text-primary" />
          Regenerate AI Plan
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No recommendations found</h3>
          <p className="text-slate-500 mb-6">Calculate your emissions first to get personalized recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} PRIORITY
                  </span>
                  {rec.roi && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      {rec.roi}% ROI
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{rec.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 mt-6 bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Investment</span>
                    <span className="font-semibold text-slate-900">
                      {rec.investment ? `₹${rec.investment.toLocaleString('en-IN')}` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Annual Savings</span>
                    <span className="font-semibold text-green-600">
                      {rec.annual_savings ? `₹${rec.annual_savings.toLocaleString('en-IN')}` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Payback Period</span>
                    <span className="font-semibold text-slate-900">
                      {rec.payback_period ? `${rec.payback_period} months` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">CO₂ Reduction</span>
                    <span className="font-semibold text-slate-900">
                      {rec.co2_reduction ? `${rec.co2_reduction} tCO₂e` : rec.estimated_reduction_range}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Impact:</span>
                    <span className="font-medium text-slate-900">{rec.impact}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Difficulty:</span>
                    <span className="font-medium text-slate-900">{rec.difficulty}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Implementation Steps
                  </h4>
                  <ul className="space-y-2">
                    {rec.implementation_steps?.map((step, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-slate-300">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
