"use client";

import React from 'react';
import { useAssessmentStore, Door } from '@/store/useAssessmentStore';
import { FIRE_DOOR_QUESTIONS } from '@/constants/questions';
import ImageUploader from './ImageUploader';

interface DoorCardProps {
  door: Door;
}

export default function DoorCard({ door }: DoorCardProps) {
  const { updateDoor } = useAssessmentStore();

  // Helper to update a specific question response
  const handleResponseChange = (qId: number, status: 'Pass' | 'Fail' | 'N/A') => {
    const newResponses = { ...door.responses, [qId]: status };
    updateDoor(door.id, { responses: newResponses });
  };

  // Check if any question is marked 'Fail' to highlight the Action field
  const hasFailures = Object.values(door.responses).includes('Fail');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Door Inspection: {door.labelId || door.id.replace('door-', '')}
          </h2>
          <p className="text-sm text-gray-500 italic">Please complete all 15 safety checks below.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col min-w-[80px]">
            <label className="text-[10px] font-bold uppercase text-gray-400">Floor Level</label>
            <input 
              type="text"
              placeholder="e.g. 0 or G"
              className="border-b border-gray-300 focus:border-red-500 outline-none py-1 text-sm font-bold"
              value={door.floorLevel}
              onChange={(e) => updateDoor(door.id, { floorLevel: e.target.value })}
            />
          </div>
          
          <div className="flex flex-col min-w-[150px]">
            <label className="text-[10px] font-bold uppercase text-gray-400">Door Location</label>
            <input 
              type="text"
              placeholder="e.g. Main Lobby"
              className="border-b border-gray-300 focus:border-red-500 outline-none py-1 text-sm font-bold"
              value={door.location}
              onChange={(e) => updateDoor(door.id, { location: e.target.value })}
            />
          </div>

          <div className="flex flex-col min-w-[100px]">
            <label className="text-[10px] font-bold uppercase text-gray-400">Label ID</label>
            <input 
              type="text"
              placeholder="e.g. 6251"
              className="border-b border-gray-300 focus:border-red-500 outline-none py-1 text-sm font-bold"
              value={door.labelId}
              onChange={(e) => updateDoor(door.id, { labelId: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-4">
        {FIRE_DOOR_QUESTIONS.map((question) => (
          <div key={question.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
            <p className="text-sm text-gray-700 flex-1 leading-relaxed">
              <span className="font-bold mr-2 text-gray-400">{question.id}.</span>
              {question.text}
            </p>
            
            <div className="flex gap-1 bg-gray-100 p-1 rounded-md self-end lg:self-center">
              {(['Pass', 'Fail', 'N/A'] as const).map((status) => {
                const isActive = door.responses[question.id] === status;
                
                let activeClass = 'text-gray-500 hover:bg-white';
                if (isActive) {
                  if (status === 'Pass') activeClass = 'bg-green-600 text-white shadow-sm';
                  if (status === 'Fail') activeClass = 'bg-red-600 text-white shadow-sm';
                  if (status === 'N/A') activeClass = 'bg-orange-500 text-white shadow-sm';
                }

                return (
                  <button
                    key={status}
                    onClick={() => handleResponseChange(question.id, status)}
                    className={`px-4 py-1.5 text-xs font-bold rounded transition-all duration-200 ${activeClass}`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ADDITIONAL NOTES & ACTION REQUIRED */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dashed">
        <div className="space-y-2">
          <label className={`text-xs font-black uppercase flex items-center gap-2 ${hasFailures ? 'text-red-600' : 'text-gray-500'}`}>
            Action Required
            {hasFailures && <span className="animate-pulse bg-red-100 px-2 py-0.5 rounded text-[10px]">Attention Needed</span>}
          </label>
          <textarea
            className={`w-full p-3 text-sm rounded-lg border focus:ring-2 outline-none transition-all ${
              hasFailures ? 'border-red-300 focus:ring-red-100 min-h-[120px]' : 'border-gray-200 focus:ring-gray-100 min-h-[100px]'
            }`}
            placeholder="What repairs or adjustments are needed?"
            value={door.actionRequired || ''}
            onChange={(e) => updateDoor(door.id, { actionRequired: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-500">Additional Notes</label>
          <textarea
            className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-100 outline-none min-h-[120px]"
            placeholder="General observations or specific site conditions..."
            value={door.notes || ''}
            onChange={(e) => updateDoor(door.id, { notes: e.target.value })}
          />
        </div>
      </div>
      
      {/* PHOTO SECTION */}
      <div className="mt-6">
        <ImageUploader 
          images={door.images} 
          onImagesChange={(newImages) => updateDoor(door.id, { images: newImages })} 
        />
      </div>
    </div>
  );
}