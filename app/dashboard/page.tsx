'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { 
  ClipboardCheck, 
  FileText, 
  Plus, 
  Clock,
  ChevronRight,
  LogOut,
  History,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchRecentData();
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  async function fetchRecentData() {
    const { data } = await supabase
      .from('inspections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setRecentInspections(data);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400 animate-pulse">
      MAE COMPLIANCE | SECURE ACCESS...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tighter leading-none text-lg">MAE COMPLIANCE</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inspector Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Session</p>
            <p className="text-xs font-bold text-slate-900">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-red-100 group transition-all"
          >
            <span className="text-xs font-bold text-slate-500 group-hover:text-red-600 transition-colors">Sign Out</span>
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 w-full">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Operations Hub</h2>
          <p className="text-slate-500 font-medium text-lg">Select a module to start an inspection or manage records.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Modules Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* FIRE DOOR MODULE */}
            <section>
              <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="h-px w-8 bg-red-200"></div>
                Fire Door Module
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Link href="/inspect/fire-door/new" className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-red-600 hover:shadow-2xl hover:shadow-red-50 transition-all">
                  <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                    <Plus className="text-red-600 w-7 h-7 group-hover:text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-900">New Inspection</h4>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">Execute a standard 15-point fire door safety assessment.</p>
                </Link>

                <Link href="/inspect/fire-door/reports" className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-100 transition-all">
                  <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors">
                    <History className="text-slate-500 w-7 h-7 group-hover:text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-900">FD Reports</h4>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">Access, edit, and generate PDFs for saved FD audits.</p>
                </Link>
              </div>
            </section>

            {/* FRA MODULE (Placeholder) */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="h-px w-8 bg-slate-200"></div>
                FRA Module
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-60">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-300">
                  <div className="bg-slate-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="text-slate-400 w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-400">New FRA</h4>
                  <p className="text-slate-400 text-sm mt-2">Comprehensive Fire Risk Assessment. (Coming Soon)</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-300">
                  <div className="bg-slate-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <History className="text-slate-400 w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-xl text-slate-400">FRA Reports</h4>
                  <p className="text-slate-400 text-sm mt-2">Historical data for building safety. (Coming Soon)</p>
                </div>
              </div>
            </section>
          </div>

          {/* Side Feed: Global Activity */}
          <aside className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
               Recent Log
            </h3>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              {recentInspections.length > 0 ? (
                recentInspections.map((item) => (
                  <div key={item.id} className="p-5 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                    <div>
                      <p className="font-bold text-slate-800 text-sm group-hover:text-red-600 transition-colors">{item.client_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.type}</span>
                        <p className="text-[10px] text-slate-400 font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <Clock className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                  <p className="text-xs font-black text-slate-300 uppercase">No Activity</p>
                </div>
              )}
              <Link href="/history" className="block p-5 text-center text-[10px] font-black text-slate-400 hover:text-red-600 bg-slate-50/50 hover:bg-red-50 transition-all uppercase tracking-widest">
                Full System Log
              </Link>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}