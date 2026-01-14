"use client";

import React from 'react';
import { useAssessmentStore } from '@/store/useAssessmentStore';

export default function StaticBlueprint() {
  const { siteDetails, doors } = useAssessmentStore();

  // Logic to count total passes/fails for the dashboard view
  const totalFailures = doors.reduce((acc, door) => {
    const hasFail = Object.values(door.responses).includes('Fail');
    return hasFail ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden text-[10px] flex flex-col h-[600px] w-full max-w-[400px]">
      {/* Mini PDF Header - Hardcoded Logos */}
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex gap-1">
          <div className="w-6 h-6 bg-blue-800 rounded-sm"></div>
          <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
        </div>
        <p className="font-bold text-gray-400">DRAFT REPORT PREVIEW</p>
      </div>

      <div className="p-6 overflow-y-auto space-y-4">
        {/* Site Details Section */}
        <div className="border-l-2 border-red-600 pl-3">
          <p className="font-black uppercase text-gray-400 text-[8px]">Site Information</p>
          <p className="font-bold text-sm leading-tight">{siteDetails.businessName || "Client Name"}</p>
          <p className="text-gray-500">{siteDetails.siteAddress || "Site Address"}</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 p-2 rounded text-center">
            <p className="text-gray-400 uppercase text-[7px] font-bold">Total Doors</p>
            <p className="text-lg font-black">{doors.length}</p>
          </div>
          <div className={`p-2 rounded text-center ${totalFailures > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            <p className="uppercase text-[7px] font-bold">Failed Units</p>
            <p className="text-lg font-black">{totalFailures}</p>
          </div>
        </div>

        {/* Mini Door List */}
        <div className="space-y-2">
          <p className="font-black uppercase text-gray-400 text-[8px] border-b pb-1">Door Breakdown</p>
          {doors.slice(0, 10).map((door, i) => (
            <div key={door.id} className="flex justify-between items-center border-b border-gray-50 py-1">
              <span className="font-medium">Door {i + 1} ({door.labelId || 'N/A'})</span>
              <span className={`px-2 py-0.5 rounded-full text-[7px] font-bold uppercase ${
                Object.values(door.responses).includes('Fail') 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {Object.values(door.responses).includes('Fail') ? 'Fail' : 'Pass'}
              </span>
            </div>
          ))}
          {doors.length > 10 && <p className="text-center text-gray-300">+{doors.length - 10} more...</p>}
        </div>

        {/* Signature Placeholder */}
        <div className="pt-10">
          <div className="w-24 h-10 border-b border-gray-300 italic text-gray-300 flex items-end">
            Engineer Sign
          </div>
        </div>
      </div>
      
      {/* Real-time sync footer */}
      <div className="mt-auto p-3 bg-red-600 text-white text-center font-bold animate-pulse">
        LIVE PREVIEW SYNCED
      </div>
    </div>
  );
}