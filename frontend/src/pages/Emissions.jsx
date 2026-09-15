import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateEmissions } from '../services/api';
import { Calculator, Zap, Fuel, Car, Trash2, ArrowRight } from 'lucide-react';

export default function Emissions() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const companyId = localStorage.getItem('companyId');
  
  useEffect(() => {
    if (!companyId) {
      navigate('/setup');
    }
  }, [companyId, navigate]);

  const [formData, setFormData] = useState({
    electricity: '',
    diesel: '',
    petrol: '',
    natural_gas: '',
    employee_commute: '',
    business_travel: '',
    waste: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || Number(value) >= 0) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const parsedData = {};
      Object.keys(formData).forEach(key => {
        parsedData[key] = formData[key] ? parseFloat(formData[key]) : 0;
      });
      
      await calculateEmissions(companyId, parsedData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to calculate emissions. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (!companyId) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          Emission Data Input
        </h1>
        <p className="mt-2 text-slate-600">Enter your operational activity data for the reporting year.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Energy Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2>Energy</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Electricity Consumption</label>
              <p className="text-xs text-slate-500 mb-2">Enter your company's total electricity consumption for the reporting year.</p>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="electricity"
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                  value={formData.electricity}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                  kWh
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fuels Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
            <Fuel className="w-5 h-5 text-red-500" />
            <h2>Fuels</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diesel</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="diesel"
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                  value={formData.diesel}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                  litres
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Petrol</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="petrol"
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                  value={formData.petrol}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                  litres
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Natural Gas</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="natural_gas"
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                  value={formData.natural_gas}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                  cubic metres
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transportation Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
            <Car className="w-5 h-5 text-blue-500" />
            <h2>Transportation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee Commuting</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="employee_commute"
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                  value={formData.employee_commute}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                  kilometres
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Travel</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="business_travel"
                  min="0"
                  step="any"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0"
                  value={formData.business_travel}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                  kilometres
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
            <Trash2 className="w-5 h-5 text-stone-500" />
            <h2>Waste</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Waste Generated</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                name="waste"
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0"
                value={formData.waste}
                onChange={handleInputChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 sm:text-sm">
                kilograms
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
          >
            {loading ? 'Calculating your carbon footprint...' : (
              <>
                Calculate Footprint <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
