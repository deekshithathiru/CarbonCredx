import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOpportunities } from '../services/api';
import { Zap, Target, AlertCircle, FileText } from 'lucide-react';

export default function Opportunities() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!companyId) {
      navigate('/setup');
      return;
    }
    
    const fetchOpps = async () => {
      try {
        const res = await getOpportunities(companyId);
        setOpportunities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpps();
  }, [companyId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500">Finding potential opportunities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          Carbon Opportunities
        </h1>
        <p className="mt-2 text-slate-600">Potential carbon projects and credit opportunities based on your profile.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3 text-blue-800 text-sm">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> Carbon-market opportunities shown are preliminary screening estimates and do not constitute certification, guaranteed credit issuance, guaranteed revenue, or investment advice. Actual eligibility, issuance, pricing, and revenue depend on applicable standards, verification, project additionality, documentation, and market conditions.
        </p>
      </div>

      <div className="mb-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Project Readiness Score</h3>
          <p className="text-sm text-slate-500">Based on data completeness and methodology alignment.</p>
        </div>
        <div className="text-4xl font-black text-primary">78 <span className="text-xl text-slate-400 font-medium">/ 100</span></div>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No strong matches found</h3>
          <p className="text-slate-500">We couldn't find any high-confidence opportunity matches for your specific emission profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {opp.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-primary">{opp.match_score}%</span>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Match</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{opp.name}</h3>
                <p className="text-sm text-slate-600">{opp.description}</p>
              </div>
              
              <div className="bg-slate-50 p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">Why it matches</h4>
                  <p className="text-sm text-slate-700">{opp.matching_reasons}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">Missing Requirements</h4>
                  <p className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-red-500 font-bold">⚠</span>
                    <span>{opp.missing_requirements}</span>
                  </p>
                  <p className="text-sm text-slate-700 flex items-start gap-2 mt-2">
                    <span className="text-red-500 font-bold">⚠</span>
                    <span>Third-party verification & Baseline documentation</span>
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-yellow-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Potentially suitable — further validation required.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
