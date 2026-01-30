"use client";

import React from 'react';
import { useAssessmentStore, Door } from '@/store/useAssessmentStore';
import { Trash2, Camera, Info, CheckCircle2, XCircle, MinusCircle, ChevronDown } from 'lucide-react';

interface DoorCardProps {
  door: Door;
  readOnly?: boolean;
}

// Keep these here but hidden for now per your suggestion
const CHECKLIST_ITEMS = [
  "Door leaf condition",
  "Frame condition & bedding",
  "Intumescent strips & smoke seals",
  "Hinges (minimum 3, no leaks)",
  "Door closer functionality",
  "Lockset/Latch functionality",
  "Vision panel & glazing integrity",
  "Threshold & floor gaps (< 8mm)",
  "Signage (Fire Door Keep Shut etc.)",
  "Self-closing speed & force",
  "Effective sealing/smoke control",
  "Strips/Seals free from paint",
  "Gaps between leaf & frame (2-4mm)",
  "Automatic release (if applicable)",
  "Overall structural integrity"
];

export default function DoorCard({ door, readOnly = false }: DoorCardProps) {
  const { updateDoor, deleteDoor } = useAssessmentStore();
  
  // Toggle this to TRUE if the client wants the full 15-point breakdown
  const SHOW_DETAILED_CHECKLIST = true;

  const handleResponseChange = (index: number, value: 'Pass' | 'Fail' | 'N/A') => {
    if (readOnly) return;
    const newResponses = { ...door.responses, [index]: value };
    updateDoor(door.id, { responses: newResponses });
  };

  return (
    <div className={`bg-white rounded-3xl border ${readOnly ? 'border-slate-200' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all`}>
      
      {/* Header Section */}
      <div className={`p-5 flex items-center justify-between ${readOnly ? 'bg-slate-50' : 'bg-white border-b border-slate-100'}`}>
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0">
            {door.labelId}
          </div>
          <input
            type="text"
            placeholder="Door Location (e.g. Ground Floor Main Entrance)"
            value={door.location}
            disabled={readOnly}
            onChange={(e) => updateDoor(door.id, { location: e.target.value })}
            className="w-full text-lg font-black uppercase tracking-tight placeholder:text-slate-300 focus:outline-none bg-transparent disabled:opacity-100"
          />
        </div>
        
        {!readOnly && (
          <button 
            onClick={() => deleteDoor(door.id)}
            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        
        {/* Simple Pass/Fail Toggle (Main Status) */}
        {!SHOW_DETAILED_CHECKLIST && (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Overall Door Result</span>
            <div className="flex gap-2">
              {['Pass', 'Fail'].map((status) => (
                <button
                  key={status}
                  disabled={readOnly}
                  onClick={() => handleResponseChange(99, status as any)} // Using index 99 for "Overall"
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    door.responses[99] === status 
                      ? (status === 'Pass' ? 'bg-green-600 text-white' : 'bg-red-600 text-white') 
                      : 'bg-white text-slate-400 border border-slate-200'
                  } ${readOnly && door.responses[99] !== status ? 'hidden' : ''}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Checklist (Hidden by default) */}
        {SHOW_DETAILED_CHECKLIST && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 animate-in fade-in slide-in-from-top-4">
            {CHECKLIST_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  {idx + 1}. {item}
                </span>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {['Pass', 'Fail', 'N/A'].map((val) => (
                    <button
                      key={val}
                      disabled={readOnly}
                      onClick={() => handleResponseChange(idx, val as any)}
                      className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${
                        door.responses[idx] === val ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'opacity-40'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Notes Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Info size={12} /> Observations & Remedials
            </label>
            <textarea
              placeholder="e.g. Door closer requires adjustment, intumescent strips missing..."
              value={door.notes}
              disabled={readOnly}
              onChange={(e) => updateDoor(door.id, { notes: e.target.value })}
              className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          {/* Photo Section */}
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Camera size={12} /> Evidence Photos
            </label>
            <div className="grid grid-cols-3 gap-3">
              {door.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative group">
                   <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
              {!readOnly && (
                <button className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:bg-slate-50 transition-all">
                  <Camera size={20} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Add Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}