import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateReport } from '../services/api';
import { FileText, Download, CheckCircle2, ShieldCheck, Settings, Eye } from 'lucide-react';

export default function Report() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  
  const [period, setPeriod] = useState('Annual');
  const [reportType, setReportType] = useState('Complete CarbonROI Report');
  const [previewMode, setPreviewMode] = useState(false);
  
  useEffect(() => {
    if (!companyId) {
      navigate('/setup');
    }
  }, [companyId, navigate]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateReport(companyId);
      const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
      const fullUrl = `${baseUrl}${res.data.file_url}`;
      setReportUrl(fullUrl);
      setPreviewMode(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!companyId) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Generate Sustainability & CarbonROI Report</h1>
        <p className="text-lg text-slate-600">
          Create a professional, management-ready PDF report containing your carbon footprint, financial impact, and ROI analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Report Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Report Type</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option>Complete CarbonROI Report</option>
                  <option>Executive Sustainability Report</option>
                  <option>Decarbonization & ROI Report</option>
                  <option>Carbon Footprint Report</option>
                  <option>Carbon Market Opportunity Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reporting Period</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option>Annual</option>
                  <option>Quarterly</option>
                  <option>Monthly</option>
                  <option>Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Included Sections</label>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {['Executive Summary', 'Carbon Footprint', 'Scope 1, 2, 3', 'Financial Impact', 'Decarbonization ROI Analysis', 'Action Plan', 'AI Recommendations', 'Carbon Market Opportunities', 'Project Readiness', 'Methodology & Data Quality'].map(section => (
                    <label key={section} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300" />
                      <span className="text-sm text-slate-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
              
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Building Report...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  GENERATE REPORT
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Report Preview
              </h3>
              {reportUrl && (
                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </a>
              )}
            </div>
            
            <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center relative">
              {loading ? (
                <div className="flex flex-col items-center text-slate-500">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                  <p>1. Collecting data...</p>
                  <p>2. Calculating financial metrics...</p>
                  <p>3. Generating PDF layout...</p>
                </div>
              ) : previewMode && reportUrl ? (
                <iframe src={reportUrl} className="w-full h-full border-0" title="PDF Preview"></iframe>
              ) : (
                <div className="text-center p-8 max-w-sm">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-900 mb-2">Configure and Generate</h4>
                  <p className="text-sm text-slate-500">
                    Select your settings on the left and click Generate Report to create a management-ready PDF.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
