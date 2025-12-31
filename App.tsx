
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Search, 
  History, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Info,
  Lock,
  Zap,
  Terminal,
  Beaker,
  AlertTriangle
} from 'lucide-react';
import { AnalysisResult, RiskLevel } from './types';
import { STORAGE_KEY, MAX_HISTORY_ITEMS, TEST_CASES } from './constants';
import { runHeuristicAnalysis } from './services/checkerService';
import { getAISmartInsight } from './services/geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showLab, setShowLab] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const addLog = (msg: string) => {
    setScanLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const handleAnalyze = async (inputUrl: string = url) => {
    if (!inputUrl.trim()) return;

    setError(null);
    setIsAnalyzing(true);
    setResult(null);
    setScanLogs([]);

    try {
      addLog("Initializing secure sweep...");
      await new Promise(r => setTimeout(r, 600));
      addLog("Parsing URL components...");
      const heuristicResult = runHeuristicAnalysis(inputUrl);
      
      addLog("Running heuristic signatures...");
      await new Promise(r => setTimeout(r, 800));
      addLog(`${heuristicResult.checks.length} vectors analyzed.`);
      
      addLog("Querying AI Threat Intelligence...");
      const summary = heuristicResult.checks.map(c => `${c.name}: ${c.status}`).join(', ');
      const aiInsight = await getAISmartInsight(heuristicResult.url, summary);
      
      const finalResult = { ...heuristicResult, aiInsights: aiInsight };
      setResult(finalResult);
      
      const updated = [finalResult, ...history.filter(h => h.url !== finalResult.url)].slice(0, MAX_HISTORY_ITEMS);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      addLog("Analysis complete. Safety score calculated.");
    } catch (err: any) {
      setError(err.message || 'Fatal scan error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 85) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'low': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5';
      case 'medium': return 'text-amber-400 border-amber-400/30 bg-amber-400/5';
      case 'high': return 'text-rose-500 border-rose-500/30 bg-rose-500/5';
    }
  };

  return (
    <div className="min-h-screen cyber-grid flex flex-col items-center py-12 px-4 md:px-8">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-violet-600/10 blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="flex justify-center mb-4">
          <div className="relative p-4 rounded-full bg-slate-900/80 border border-slate-800 shadow-2xl">
            <ShieldCheck className="w-12 h-12 text-violet-500 glow-shadow" />
            <div className="absolute top-0 right-0 animate-ping">
              <div className="w-3 h-3 bg-violet-500 rounded-full opacity-75"></div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 mb-2 tracking-tight">
          SECURE_SCAN.IO
        </h1>
        <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Cyber-Threat Neutralization Engine</p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Input Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="relative z-10">
            <div className="relative">
              <input 
                type="text"
                placeholder="Target URL / Domain..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-violet-500/50 rounded-xl py-4 pl-12 pr-32 transition-all outline-none text-slate-200 placeholder:text-slate-600 font-mono text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="absolute inset-y-0 left-4 flex items-center"><Search className="w-4 h-4 text-slate-600" /></div>
              <button 
                type="submit"
                disabled={isAnalyzing || !url}
                className="absolute right-2 top-2 bottom-2 px-6 rounded-lg font-bold text-xs tracking-widest bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isAnalyzing ? <><Zap className="w-3 h-3 animate-spin" /> SCANNING</> : 'RUN SCAN'}
              </button>
            </div>
          </form>

          {/* Real-time Logs */}
          {isAnalyzing && (
            <div className="mt-4 p-3 bg-black/40 rounded-lg border border-slate-800 font-mono text-[10px] text-violet-400/80 space-y-1 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-slate-500 mb-1 border-b border-slate-800/50 pb-1">
                <Terminal className="w-3 h-3" /> SECURITY_KNL_LOG
              </div>
              {scanLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && !isAnalyzing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className={`p-8 text-center border-b border-slate-800 relative ${getRiskColor(getRiskLevel(result.score))}`}>
                <div className="flex justify-center mb-4">
                  {result.score >= 85 ? <ShieldCheck className="w-16 h-16" /> : 
                   result.score >= 50 ? <ShieldAlert className="w-16 h-16" /> : 
                   <ShieldX className="w-16 h-16" />}
                </div>
                <div className="text-5xl font-black tracking-tighter mb-1">{result.score}%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Confidence Score</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/50 border border-white/10 text-[10px] font-mono text-slate-400">
                  <Lock className="w-3 h-3" /> {result.url}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {result.aiInsights && (
                  <div className="bg-violet-600/5 border border-violet-500/20 rounded-xl p-4 relative group">
                    <div className="absolute -left-px top-4 bottom-4 w-1 bg-violet-500 rounded-r-full"></div>
                    <div className="flex items-center gap-2 mb-2 text-violet-400 font-bold uppercase text-[10px] tracking-widest">
                      <Zap className="w-3 h-3 fill-current" /> Intelligent Threat Intel
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{result.aiInsights}"</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Heuristic Breakdown
                  </h3>
                  <div className="grid gap-2">
                    {result.checks.map((check) => (
                      <div key={check.id} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800 rounded-lg group">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${
                             check.status === 'passed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                             check.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                             'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                           }`} />
                           <span className="text-xs font-bold text-slate-300">{check.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 max-w-[200px] text-right truncate">{check.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lab Testing Section */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
          <button 
            onClick={() => setShowLab(!showLab)}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-800/50 transition-colors"
          >
            <span className="flex items-center gap-2"><Beaker className="w-4 h-4" /> Security Lab Testing</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${showLab ? 'rotate-90' : ''}`} />
          </button>
          
          {showLab && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEST_CASES.map((tc, i) => (
                <button 
                  key={i}
                  onClick={() => { setUrl(tc.url); handleAnalyze(tc.url); }}
                  className="p-3 text-left bg-slate-900 border border-slate-800 rounded-lg hover:border-violet-500/50 transition-all group"
                >
                  <div className="text-[10px] font-bold text-violet-400 mb-1">{tc.name}</div>
                  <div className="text-[9px] font-mono text-slate-600 truncate">{tc.url}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800/50">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Sweeps
              </span>
              <button onClick={() => { setHistory([]); localStorage.removeItem(STORAGE_KEY); }} className="text-[9px] text-rose-500/50 hover:text-rose-500 transition-colors uppercase font-bold">Flush Memory</button>
            </div>
            <div className="space-y-2">
              {history.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setResult(item)}
                  className="w-full p-3 bg-slate-900/20 border border-slate-800/30 rounded-lg flex items-center justify-between hover:bg-slate-800/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold ${getRiskColor(getRiskLevel(item.score))}`}>{item.score}%</div>
                    <div className="text-xs text-slate-400 truncate max-w-[150px]">{item.url}</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-700" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
