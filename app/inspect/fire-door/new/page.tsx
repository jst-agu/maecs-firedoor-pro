"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { useAssessmentStore } from '@/store/useAssessmentStore';

// Components
import AppHeader from '@/components/layout/AppHeader';
import SiteDetails from '@/components/forms/SiteDetails';
import DoorCard from '@/components/forms/DoorCard';
import StaticBlueprint from '@/components/preview/StaticBluePrint';
import Sidebar from '@/components/layout/Sidebar';

// Icons
import { Save, CheckCircle, AlertCircle, Lock, ArrowLeft } from 'lucide-react';

// Wrapper component to handle search params safely in Next.js
function InspectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { siteDetails, doors, isSidebarCollapsed } = useAssessmentStore();
  
  // 1. Check if we are in "View Only" mode
  const isViewOnly = searchParams.get('viewOnly') === 'true';
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleFinalSync = async (status: 'pending_audit' | 'draft') => {
    if (isViewOnly) return; // Safety check

    if (!siteDetails.businessName) {
      alert("Required: Please enter a Business Name before saving.");
      return;
    }
    if (doors.length === 0) {
      alert("Required: Please add at least one door.");
      return;
    }

    setIsSyncing(true);

    try {
      const { error } = await supabase.from('inspections').insert([{
        type: 'fire-door',
        client_name: siteDetails.businessName,
        project_name: siteDetails.siteAddress,
        status: status,
        created_by: user?.id,
        data: {
          siteDetails,
          doors,
          inspectionDate: new Date().toISOString()
        }
      }]);

      if (error) throw error;

      alert(status === 'pending_audit' 
        ? "SUCCESS: Report submitted for Audit." 
        : "SUCCESS: Report saved as Draft.");
      
      router.push('/inspect/fire-door/reports');

    } catch (error: any) {
      console.error("Sync Error:", error);
      alert(`Sync failed: ${error.message}`);
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

          {/* View Only Banner */}
          {isViewOnly && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-amber-800">
                <Lock size={18} className="text-amber-600" />
                <span className="text-sm font-bold uppercase tracking-wide">Read-Only Mode: This report is locked for audit.</span>
              </div>
              <button 
                onClick={() => router.push('/inspect/fire-door/reports')}
                className="flex items-center gap-2 text-xs font-black uppercase text-amber-700 hover:text-amber-900"
              >
                <ArrowLeft size={14} /> Back to Reports
              </button>
            </div>
          )}

          <div className="flex flex-col xl:flex-row gap-8 mt-6">
            
            {/* LEFT COLUMN: Data Entry */}
            <div className={`flex-1 space-y-8 pb-32 ${isViewOnly ? 'pointer-events-none' : ''}`}>
              <SiteDetails readOnly={isViewOnly} />
              
              <div className="space-y-8">
                {doors.map((door) => (
                  <div key={door.id} id={door.id}>
                    <DoorCard door={door} readOnly={isViewOnly} />
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
                    Report Actions
                  </h3>
                  
                  {!isViewOnly ? (
                    <>
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

                      <button 
                        disabled={isSyncing}
                        onClick={() => handleFinalSync('draft')}
                        className="w-full bg-slate-100 text-slate-800 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Save size={16} className="text-slate-400" />
                        Save Report
                      </button>
                    </>
                  ) : (
                    <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center">
                      <Lock size={24} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">
                        Submission Disabled <br/> in Read-Only Mode
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 rounded-lg flex gap-2 border border-blue-100">
                    <AlertCircle size={14} className="text-blue-600 shrink-0" />
                    <p className="text-[9px] text-blue-800 leading-tight">
                      {isViewOnly 
                        ? "You are viewing a synchronized cloud record." 
                        : "Note: PDF generation is restricted until the report has been reviewed."}
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

// Main exported component with Suspense boundary (Required for useSearchParams)
export default function NewInspectionPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black uppercase text-slate-400">Loading Form...</div>}>
      <InspectionContent />
    </Suspense>
  );
}