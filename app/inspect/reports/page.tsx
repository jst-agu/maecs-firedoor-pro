"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Sidebar from '@/components/layout/Sidebar';
import AppHeader from '@/components/layout/AppHeader';
import { useAssessmentStore } from '@/store/useAssessmentStore';

// Icons
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  Lock,
  Edit3
} from 'lucide-react';

export default function ReportsHistoryPage() {
  const router = useRouter();
  const { isSidebarCollapsed } = useAssessmentStore();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending_audit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <AppHeader />

          <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">
                Inspection <span className="text-red-600">History</span>
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Manage cloud-synced reports and drafts
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Client or Site..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-20 text-center font-black uppercase text-slate-300 animate-pulse">
                Fetching Reports...
              </div>
            ) : reports.length === 0 ? (
              <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <FileText className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-sm font-black uppercase text-slate-400">No reports found in the cloud</p>
              </div>
            ) : (
              reports.map((report) => (
                <div 
                  key={report.id}
                  onClick={() => {
                    // Logic: If pending audit, open with viewOnly flag
                    const baseUrl = '/inspect/fire-door/new';
                    const isLocked = report.status === 'pending_audit' || report.status === 'completed';
                    router.push(`${baseUrl}?id=${report.id}${isLocked ? '&viewOnly=true' : ''}`);
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getStatusStyle(report.status)}`}>
                        {report.status === 'pending_audit' ? <Lock size={20} /> : <Edit3 size={20} />}
                      </div>
                      
                      <div>
                        <h3 className="font-black uppercase text-sm text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                          {report.client_name || 'Unnamed Client'}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Clock size={10} /> {new Date(report.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            ID: {report.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-red-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}