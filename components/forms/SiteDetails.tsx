"use client";

import React from 'react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { Building2, MapPin, User, Hash, Phone, CheckCircle } from 'lucide-react';
// Importing your base64 constants
import { OWNER_SIGNATURE } from '@/constants/assets';

interface SiteDetailsProps {
  readOnly?: boolean;
}

export default function SiteDetails({ readOnly = false }: SiteDetailsProps) {
  const { siteDetails, setSiteDetails } = useAssessmentStore();

  const handleChange = (field: string, value: string | number | boolean) => {
    if (readOnly) return;
    setSiteDetails({ [field]: value });
  };

  return (
    <div className={`bg-white p-8 rounded-3xl border ${readOnly ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200 shadow-sm'}`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <Building2 size={20} />
        </div>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
          Site & Customer <span className="text-red-600">Information</span>
        </h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <Building2 size={12} /> Business / Client Name
          </label>
          <input
            type="text"
            value={siteDetails.businessName}
            disabled={readOnly}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-transparent"
            placeholder="e.g. Metro Property Group"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <MapPin size={12} /> Site Address
          </label>
          <input
            type="text"
            value={siteDetails.siteAddress}
            disabled={readOnly}
            onChange={(e) => handleChange('siteAddress', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-transparent"
            placeholder="Full site location details..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <User size={12} /> Site Contact Name
          </label>
          <input
            type="text"
            value={siteDetails.customerName}
            disabled={readOnly}
            onChange={(e) => handleChange('customerName', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <Hash size={12} /> Certificate Number
          </label>
          <div className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-500 tracking-wider">
            {siteDetails.certNumber}
          </div>
        </div>

        {/* --- AUTHENTICATED OWNER SIGNATURE --- */}
        <div className="space-y-2 lg:pt-0 pt-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <CheckCircle size={12} className="text-green-600" /> Authenticated Sign-off
          </label>
          <div className="h-[52px] flex items-center justify-between px-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner relative">
             <span className="text-[8px] font-black text-slate-300 uppercase italic leading-tight">
               Verified <br/> Electronic Signature
             </span>
             {/* Using your base64 OWNER_SIGNATURE constant */}
             <img 
               src={OWNER_SIGNATURE} 
               alt="Owner Signature" 
               className="h-12 object-contain mix-blend-multiply"
             />
          </div>
        </div>
      </div>
    </div>
  );
}