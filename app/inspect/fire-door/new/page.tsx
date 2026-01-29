"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { useAssessmentStore } from '@/store/useAssessmentStore';

// Your "Lite" Version Components
import AppHeader from '@/components/layout/AppHeader';
import SiteDetails from '@/components/forms/SiteDetails';
import DoorCard from '@/components/forms/DoorCard';
import StaticBlueprint from '@/components/preview/StaticBluePrint';
import Sidebar from '@/components/layout/Sidebar';

// Icons
import { Cloud, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewInspectionPage() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const { siteDetails, doors, isSidebarCollapsed } = useAssessmentStore();
  
  // Get current logged-in user
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // MASTER SYNC FUNCTION
  const handleFinalSync = async (status: 'pending_audit' | 'draft') => {
    if (!siteDetails.businessName) {
      alert("Required: Please enter a Business Name before saving.");
      return;
    }
    if (doors.length === 0) {
      alert("Required: Please add at least one door to the inspection.");
      return;
    }

    setIsSyncing(true);

    try {
      const { error } = await supabase.from('inspections').insert([{
        type: 'fire-door',
        client_name: siteDetails.businessName,
        project_name: siteDetails.siteAddress,
        status: status, // 'pending_audit' or 'draft'
        created_by: user?.id,
        data: {
          siteDetails,
          doors,
          inspectionDate: new Date().toISOString()
        }
      }]);

      if (error) throw error;

      alert(status === 'pending_audit' 
        ? "SUCCESS: Report submitted to Admin for Audit." 
        : "SUCCESS: Report saved as Draft.");
      
      router.push('/inspect/fire-door/reports');

    } catch (error: any) {
      console.error("Sync Error:", error);
      // Detailed error alert to debug the "Save" failure
      alert(`Sync failed: ${error.message || 'Check console for details'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          
          <AppHeader />

          <div className="flex flex-col xl:flex-row gap-8 mt-6">
            
            {/* LEFT COLUMN: Data Entry */}
            <div className="flex-1 space-y-8 pb-32">
              <SiteDetails />
              
              <div className="space-y-8">
                {doors.map((door) => (
                  <div key={door.id} id={door.id}>
                    <DoorCard door={door} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Preview & Actions */}
            <div className="w-full xl:w-80 shrink-0">
              <div className="sticky top-8 space-y-4">
                <StaticBlueprint />

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">
                    Submission Logic
                  </h3>
                  
                  {/* OPTION 1: SEND TO AUDIT */}
                  <button 
                    disabled={isSyncing}
                    onClick={() => handleFinalSync('pending_audit')}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-100 disabled:bg-slate-300"
                  >
                    <div className="flex items-center gap-2">
                       <CheckCircle size={18} />
                       <span>Send to Audit</span>
                    </div>
                    <span className="text-[8px] opacity-70 font-bold">FINAL SUBMISSION</span>
                  </button>

                  {/* OPTION 2: SAVE ONLY (DRAFT) */}
                  <button 
                    disabled={isSyncing}
                    onClick={() => handleFinalSync('draft')}
                    className="w-full bg-slate-100 text-slate-800 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} className="text-slate-400" />
                    Save Report
                  </button>

                  <div className="p-3 bg-amber-50 rounded-lg flex gap-2 border border-amber-100">
                    <AlertCircle size={14} className="text-amber-600 shrink-0" />
                    <p className="text-[9px] text-amber-800 leading-tight">
                      Note: PDF generation is restricted until the report has been reviewed by an administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}