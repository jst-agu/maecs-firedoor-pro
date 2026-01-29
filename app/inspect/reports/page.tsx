"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import AppHeader from '@/components/layout/AppHeader';
import Sidebar from '@/components/layout/Sidebar';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { FileText, Clock, ChevronRight, Inbox, ClipboardList, Search } from 'lucide-react';

export default function ReportsPage() {
  const { isSidebarCollapsed } = useAssessmentStore();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending_audit'>('all');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('type', 'fire-door')
        .order('created_at', { ascending: false });

      if (!error) setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, []);

  // Filter logic for the UI
  const filteredReports = reports.filter(r => 
    activeTab === 'all' ? true : r.status === activeTab
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <div className="p-8 max-w-6xl mx-auto">
          <AppHeader />
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">INSPECTION <span className="text-red-600">REPORTS</span></h2>
            <p className="text-slate-500 text-sm">Manage your synchronized fire door assessments.</p>
          </div>

          {/* TAB SYSTEM */}
          <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
            {[
              { id: 'all', label: 'All Reports', icon: <Inbox size={14}/> },
              { id: 'draft', label: 'Drafts', icon: <ClipboardList size={14}/> },
              { id: 'pending_audit', label: 'Awaiting Audit', icon: <Clock size={14}/> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-sm uppercase tracking-widest">Loading Cloud Data...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-20 text-center">
                <Search size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No {activeTab.replace('_', ' ')} reports found.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-xl ${
                      report.status === 'pending_audit' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{report.client_name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border ${
                          report.status === 'pending_audit' 
                          ? 'border-amber-200 text-amber-600 bg-amber-50' 
                          : 'border-blue-200 text-blue-600 bg-blue-50'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">{report.project_name || 'No address provided'}</p>
                      <div className="flex gap-4 mt-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                           <Clock size={12} className="text-slate-300" /> 
                           {new Date(report.created_at).toLocaleDateString('en-GB')}
                         </span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 border-l pl-4">
                           Doors: <span className="text-slate-700">{report.data?.doors?.length || 0}</span>
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right pr-4 border-r border-slate-100">
                       <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Inspector</p>
                       <p className="text-xs font-bold text-slate-600">
                        {report.data?.siteDetails?.engineerInitials || 'ENG'}
                       </p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-red-600 transition-colors" />
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