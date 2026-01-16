"use client";

import React from 'react';
import { useAssessmentStore } from '@/store/useAssessmentStore';

export default function SiteDetails() {
  const { siteDetails, setSiteDetails, initializeDoors } = useAssessmentStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSiteDetails({ [name]: value });
  };

  const handleToggleRemedial = () => {
    setSiteDetails({ remedialRequired: !siteDetails.remedialRequired });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          SITE <span className="text-red-600">DETAILS</span>
        </h2>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Date of Inspection</p>
          <p className="text-sm font-mono font-bold">{new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Business & Client Info */}
        <div className="flex flex-col gap-1 lg:col-span-2">
          <label className="text-xs font-bold uppercase text-gray-500">Business Name</label>
          <input
            name="businessName"
            type="text"
            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
            value={siteDetails.businessName}
            onChange={handleChange}
            placeholder="Client company name"
          />
        </div>

        <div className="flex flex-col gap-1 lg:col-span-2">
          <label className="text-xs font-bold uppercase text-gray-500">Site Address</label>
          <input
            name="siteAddress"
            type="text"
            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
            value={siteDetails.siteAddress}
            onChange={handleChange}
            placeholder="Full site location"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">Customer Name</label>
          <input
            name="customerName"
            type="text"
            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg outline-none"
            value={siteDetails.customerName}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">Customer Phone</label>
          <input
            name="customerPhone"
            type="tel"
            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg outline-none"
            value={siteDetails.customerPhone}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">Customer Email</label>
          <input
            name="customerEmail"
            type="email"
            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg outline-none"
            value={siteDetails.customerEmail}
            onChange={handleChange}
          />
        </div>

        {/* Engineer & Certification */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">Engineer Name</label>
          <input
            name="engineerInitials"
            type="text"
            // maxLength={3}
            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg outline-none font-bold uppercase text-center w-24"
            value={siteDetails.engineerInitials}
            onChange={handleChange}
            placeholder="JS"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-gray-500">Cert Number</label>
          <input
            name="certNumber"
            type="text"
            className="p-2.5 border border-gray-200 rounded-lg text-gray-600 bg-gray-50 font-mono text-sm"
            value={siteDetails.certNumber}
            onChange={handleChange}
          />
        </div>
          {/* <hr /> */}
        {/* THE CRITICAL INPUTS */}
        <div className="flex flex-col gap-1 p-4 bg-red-50 rounded-xl border border-red-100 lg:col-span-2">
          <label className="text-xs font-black uppercase text-red-600 mb-2">Setup Inspection</label>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Total Doors</p>
              <input
                name="doorCount"
                type="number"
                min="0"
                className="w-full p-2 border-2 border-red-200 rounded-lg focus:border-red-500 outline-none font-black text-xl text-red-700"
                value={siteDetails.doorCount}
                onChange={handleChange}
                onBlur={() => {
                   const count = parseInt(siteDetails.doorCount.toString());
                   if (count > 0) initializeDoors(count);
                }}
              />
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Remedial Works?</p>
              <button
                onClick={handleToggleRemedial}
                className={`w-full py-3 rounded-lg font-bold text-xs transition-all border-2 ${
                  siteDetails.remedialRequired 
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' 
                  : 'bg-white border-red-200 text-red-300'
                }`}
              >
                {siteDetails.remedialRequired ? 'YES - REQUIRED' : 'NO - CLEAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}