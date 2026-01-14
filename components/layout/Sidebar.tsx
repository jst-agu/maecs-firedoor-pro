"use client";

import React from 'react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { ChevronLeft, ChevronRight, DoorOpen, Info } from 'lucide-react';

export default function Sidebar() {
  // Pull the global state and toggle function from Zustand
  const { isSidebarCollapsed, toggleSidebar, doors, siteDetails } = useAssessmentStore();

  const scrollToDoor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside 
      className={`bg-slate-900 h-screen fixed left-0 top-0 text-white transition-all duration-300 z-50 flex flex-col
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-red-600 text-white rounded-full p-1 border-2 border-slate-900 hover:bg-red-500 transition-colors cursor-pointer"
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand Section */}
      <div className={`p-6 mb-4 ${isSidebarCollapsed ? 'px-4 flex justify-center' : ''}`}>
        {!isSidebarCollapsed ? (
          <>
            <h1 className="text-xl font-black tracking-tighter text-red-500 leading-none">FIRE DOOR</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Inspection Module</p>
          </>
        ) : (
          <div className="bg-red-600 w-8 h-8 rounded flex items-center justify-center font-black">F</div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-6">
        <div>
          {!isSidebarCollapsed && <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-2">Assessment</p>}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`flex items-center gap-3 text-sm w-full p-2 rounded hover:bg-slate-800 transition-colors
              ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Info size={18} className="text-blue-400 shrink-0" />
            {!isSidebarCollapsed && <span>Site Details</span>}
          </button>
        </div>

        <div>
          {!isSidebarCollapsed && (
             <div className="flex justify-between items-center mb-2 px-2">
               <p className="text-[10px] font-bold text-gray-500 uppercase">Doors ({doors.length})</p>
             </div>
          )}
          
          <div className="space-y-1">
            {doors.map((door, index) => {
              const hasFail = Object.values(door.responses).includes('Fail');
              
              return (
                <button
                  key={door.id}
                  onClick={() => scrollToDoor(door.id)}
                  className={`group w-full flex items-center p-2 rounded hover:bg-slate-800 transition-colors
                    ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <DoorOpen size={16} className={`shrink-0 ${hasFail ? 'text-red-500' : 'text-gray-400'}`} />
                    {!isSidebarCollapsed && (
                      <span className="text-sm truncate">
                        {door.labelId || `Door ${index + 1}`}
                      </span>
                    )}
                  </div>
                  
                  {hasFail && !isSidebarCollapsed && (
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {!isSidebarCollapsed && (
        <div className="p-4 bg-slate-800 m-4 rounded-lg">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Client</p>
          <p className="text-xs truncate font-medium">{siteDetails.businessName || 'N/A'}</p>
        </div>
      )}
    </aside>
  );
}