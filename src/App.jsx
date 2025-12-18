import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Moon, 
  Sun, 
  CheckCircle, 
  Scale, 
  Droplet, 
  Utensils, 
  ArrowRight, 
  X,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Heart,
  Edit2,       
  ExternalLink,
  Save,
  Calendar
} from 'lucide-react';

// --- Constants ---
// YOUR GOOGLE SHEET URL
const GOOGLE_SHEET_URL = "[https://docs.google.com/spreadsheets/d/15fovsh5vsZt3rr0GUEqSh89pbRcYPLh_ohbQs8ZUtA8/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/15fovsh5vsZt3rr0GUEqSh89pbRcYPLh_ohbQs8ZUtA8/edit?gid=0#gid=0)"; 

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ${className}`}>
    {children}
  </div>
);

const ProgressRing = ({ radius, stroke, progress, color = "text-emerald-500" }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor" fill="transparent" strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: 0 }}
          r={normalizedRadius} cx={radius} cy={radius}
          className="text-slate-100"
        />
        <circle
          stroke="currentColor" fill="transparent" strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }} strokeLinecap="round"
          r={normalizedRadius} cx={radius} cy={radius}
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute text-xl font-bold text-slate-700">{progress}%</div>
    </div>
  );
};

const ChecklistItem = ({ label, subtext, checked, onToggle, icon: Icon, color = "bg-emerald-100 text-emerald-600" }) => (
  <div onClick={onToggle} className={`flex items-center p-3 rounded-xl mb-3 cursor-pointer transition-all border ${
      checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-300'
    }`}>
    <div className={`p-2 rounded-lg mr-3 ${checked ? 'bg-emerald-500 text-white' : color}`}>
      {Icon ? <Icon size={20} /> : <Activity size={20} />}
    </div>
    <div className="flex-1">
      <h4 className={`font-medium ${checked ? 'text-emerald-900 line-through opacity-70' : 'text-slate-800'}`}>
        {label}
      </h4>
      {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
      checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
    }`}>
      {checked && <CheckCircle size={16} className="text-white" />}
    </div>
  </div>
);

const TargetCard = ({ title, current, target, unit, icon: Icon, color }) => (
  <div className="flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-100">
    <div className="flex items-center text-slate-500 mb-2">
      <Icon size={14} className="mr-1" />
      <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <div>
        <span className="text-2xl font-bold text-slate-800">{current}</span>
        <span className="text-xs text-slate-400 ml-1">Current</span>
      </div>
      <div className="text-right">
        <span className={`text-sm font-semibold ${color}`}>{target}</span>
        <span className="text-xs text-slate-400 ml-1">{unit}</span>
      </div>
    </div>
    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
      <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${Math.min((current / target) * 100, 100)}%` }}></div>
    </div>
  </div>
);

const LogModal = ({ isOpen, onClose, currentMetrics, onSave }) => {
  const [formData, setFormData] = useState({
    ...currentMetrics,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if(isOpen) {
      setFormData({
        ...currentMetrics,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [isOpen, currentMetrics]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (openSheet) => {
    onSave(formData);
    if (openSheet) {
      // Format data for spreadsheet paste (Tab separated)
      const rowData = `${formData.date}\t${formData.weight}\t${formData.fastingSugar}\t${formData.postMealSugar}`;
      
      const textArea = document.createElement("textarea");
      textArea.value = rowData;
      document.body.appendChild(textArea);
      textArea.select();
      try { document.execCommand('copy'); } catch (err) { console.error('Copy failed', err); }
      document.body.removeChild(textArea);

      window.open(GOOGLE_SHEET_URL, '_blank');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Log Measurements</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X size={24} className="text-slate-400" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
            <div className="relative">
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"/>
              <Calendar size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Weight (kg)</label>
            <div className="relative">
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <Scale size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Fasting Sugar (mg/dL)</label>
             <div className="relative">
              <input type="number" name="fastingSugar" value={formData.fastingSugar} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
              <Droplet size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Post-Meal Sugar (mg/dL)</label>
             <div className="relative">
              <input type="number" name="postMealSugar" value={formData.postMealSugar} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              <Activity size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <button onClick={() => handleSave(false)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900"><Save size={18} /> Save to App</button>
          <button onClick={() => handleSave(true)} className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100"><ExternalLink size={18} /> Save & Open Sheet</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLogModal, setShowLogModal] = useState(false);
  
  const [dailyHabits, setDailyHabits] = useState({
    walk: false, strength: false, hiit: false, sleep: false, screens: false, vitD: false, magnesium: false, fasting: false, meditation: false, movement: false, measure: false,
  });

  const [metrics, setMetrics] = useState({ weight: 71.5, fastingSugar: 102, postMealSugar: 140 });

  const toggleHabit = (key) => setDailyHabits(prev => ({ ...prev, [key]: !prev[key] }));

  const calculateProgress = () => {
    const total = Object.keys(dailyHabits).length;
    const completed = Object.values(dailyHabits).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const DashboardView = () => (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex justify-between items-start">
        <div><h1 className="text-2xl font-bold text-slate-800">Hello, User</h1><p className="text-slate-500 text-sm mt-1">Exercise + Sleep + Stress = Success</p></div>
        <div onClick={() => setCurrentPage('food')} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center cursor-pointer hover:bg-orange-100 transition-colors">
          <Utensils size={16} className="mr-2" /> Food Guide
        </div>
      </div>
      <Card className="flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
        <div><h2 className="text-lg font-semibold text-slate-100">Daily Goals</h2><p className="text-slate-400 text-sm mb-4">Keep your streak alive</p><div className="flex gap-2 text-xs"><span className="bg-white/10 px-2 py-1 rounded">Pre-Diabetes Reversal</span></div></div>
        <ProgressRing radius={45} stroke={6} progress={calculateProgress()} color="text-emerald-400" />
      </Card>
      <div>
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-bold text-slate-800">My Targets</h3>
          <button onClick={() => setShowLogModal(true)} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium cursor-pointer flex items-center gap-1 hover:bg-blue-100"><Edit2 size={12} /> Update Metrics</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TargetCard title="Weight Goal" current={`${metrics.weight}`} target="65" unit="kg" icon={Scale} color="text-blue-500"/>
          <TargetCard title="Fasting Sugar" current={`${metrics.fastingSugar}`} target="80" unit="mg/dL" icon={Droplet} color="text-emerald-500"/>
          <TargetCard title="Post-Meal" current={`${metrics.postMealSugar}`} target="120" unit="mg/dL" icon={Activity} color="text-purple-500"/>
          <TargetCard title="HbA1c" current="5.4" target="< 5" unit="%" icon={Heart} color="text-rose-500"/>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-slate-800 mb-3">Daily Habits</h3>
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Movement</span>
          <ChecklistItem label="Pre-meal Walking" subtext="At least 15 mins before eating" checked={dailyHabits.walk} onToggle={() => toggleHabit('walk')} icon={Activity} color="bg-orange-100 text-orange-600"/>
          <ChecklistItem label="Strength Training" subtext="30 min (Goal: 3x/week)" checked={dailyHabits.strength} onToggle={() => toggleHabit('strength')} icon={Activity} color="bg-orange-100 text-orange-600"/>
           <ChecklistItem label="High Intensity (HIIT)" subtext="45 min (Goal: 2-3x/week)" checked={dailyHabits.hiit} onToggle={() => toggleHabit('hiit')} icon={TrendingUp} color="bg-orange-100 text-orange-600"/>
          <ChecklistItem label="Stand & Stretch" subtext="Move every 30 minutes" checked={dailyHabits.movement} onToggle={() => toggleHabit('movement')} icon={Activity} color="bg-orange-100 text-orange-600"/>
        </div>
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Rest & Mind</span>
          <ChecklistItem label="Sleep 7-8 Hours" subtext="Essential for recovery" checked={dailyHabits.sleep} onToggle={() => toggleHabit('sleep')} icon={Moon} color="bg-indigo-100 text-indigo-600"/>
          <ChecklistItem label="No Screens" subtext="Avoid 9:00 PM to 8:00 AM" checked={dailyHabits.screens} onToggle={() => toggleHabit('screens')} icon={AlertCircle} color="bg-indigo-100 text-indigo-600"/>
          <ChecklistItem label="Meditation" subtext="20 minutes daily" checked={dailyHabits.meditation} onToggle={() => toggleHabit('meditation')} icon={Sun} color="bg-indigo-100 text-indigo-600"/>
        </div>
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Nutrition & Tracking</span>
          <ChecklistItem label="Intermittent Fasting" subtext="14 hour window" checked={dailyHabits.fasting} onToggle={() => toggleHabit('fasting')} icon={Utensils} color="bg-emerald-100 text-emerald-600"/>
          <ChecklistItem label="Take Supplements" subtext="Vit D (2-4k IU), Magnesium (300-400mg)" checked={dailyHabits.vitD} onToggle={() => toggleHabit('vitD')} icon={CheckCircle} color="bg-emerald-100 text-emerald-600"/>
          <ChecklistItem label="Log Measurements" subtext="Tap to log Weight & Sugar" checked={dailyHabits.measure} onToggle={() => setShowLogModal(true)} icon={TrendingDown} color="bg-blue-100 text-blue-600"/>
        </div>
      </div>
    </div>
  );

  const FoodHelperView = () => {
    const foodCategories = [
      { title: "Protein Powerhouses", color: "bg-blue-50 border-blue-100", textColor: "text-blue-800", items: ["Tofu", "Tempeh", "Greek Yogurt", "Soya Chunk", "Paneer"] },
      { title: "High Fiber & Grains", color: "bg-amber-50 border-amber-100", textColor: "text-amber-800", items: ["Quinoa", "Rajma (Kidney Beans)", "Chole (Chickpeas)", "Lentils", "High Fiber Foods"] },
      { title: "Seeds & Essentials", color: "bg-emerald-50 border-emerald-100", textColor: "text-emerald-800", items: ["Hemp Seeds", "Chia Seeds", "Flax Seeds", "Olive Oil (Increase)"] },
      { title: "Fresh Produce", color: "bg-green-50 border-green-100", textColor: "text-green-800", items: ["High Fruit Intake", "Beans", "Vegetables"] }
    ];
    const avoidList = ["White Rice", "Ice Cream", "White Bread", "Cheese", "Ghee", "Sugar"];

    return (
      <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => setCurrentPage('dashboard')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"><ArrowRight className="rotate-180" size={20} /></button>
          <h1 className="text-2xl font-bold text-slate-800">Healthy Food Helper</h1>
        </div>
        <Card className="bg-emerald-600 text-white border-none relative overflow-hidden">
          <div className="relative z-10"><h2 className="text-xl font-bold mb-1">Eat This</h2><p className="opacity-90 text-sm">Focus on Protein Rich • Low Carb • High Fiber</p></div>
          <Utensils className="absolute right-[-20px] bottom-[-20px] text-emerald-500 opacity-50" size={120} />
        </Card>
        <div className="grid grid-cols-1 gap-4">
          {foodCategories.map((cat, idx) => (
            <div key={idx} className={`rounded-xl p-4 border ${cat.color}`}>
              <h3 className={`font-bold mb-3 ${cat.textColor}`}>{cat.title}</h3>
              <div className="flex flex-wrap gap-2">{cat.items.map((item, i) => (<span key={i} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-700 shadow-sm border border-slate-100">{item}</span>))}</div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center"><AlertCircle size={18} className="text-rose-500 mr-2" /> Diet Decrease (Avoid)</h3>
          <div className="bg-rose-50 rounded-xl p-4 border border-rose-100"><div className="flex flex-wrap gap-2">{avoidList.map((item, i) => (<span key={i} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-rose-800 shadow-sm border border-rose-100 opacity-75 decoration-rose-400">{item}</span>))}</div></div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-100 flex items-start">
           <Droplet className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
           <div><h4 className="font-bold text-blue-900 text-sm">Hydration & Supplements</h4><p className="text-xs text-blue-700 mt-1">Don't forget your daily Magnesium (300-400mg) and Vitamin D (2k-4k IU).</p></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      <LogModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} currentMetrics={metrics} onSave={(newMetrics) => { setMetrics(newMetrics); toggleHabit('measure'); }} />
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-400 to-blue-500 w-full"></div>
        <main className="p-6 h-full overflow-y-auto">{currentPage === 'dashboard' ? <DashboardView /> : <FoodHelperView />}</main>
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-2 py-2 flex gap-2 pointer-events-auto">
            <button onClick={() => setCurrentPage('dashboard')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentPage === 'dashboard' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>Today</button>
            <button onClick={() => setCurrentPage('food')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currentPage === 'food' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>Food</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }`}</style>
    </div>
  );
}