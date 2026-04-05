import React, { useState, useCallback } from 'react';
import Map from './components/Map';
import JobPanel from './components/JobPanel';
import { INITIAL_EMPLOYEES, INITIAL_JOBS } from './constants';
import { Employee, Job } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Map as MapIcon, Users, Briefcase, Info } from 'lucide-react';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  const handleSelectEmployee = useCallback((id: string) => {
    setSelectedEmployeeId(prev => prev === id ? null : id);
  }, []);

  const handleSelectJob = useCallback((id: string) => {
    setSelectedJobIds(prev => 
      prev.includes(id) 
        ? prev.filter(jobId => jobId !== id) 
        : [...prev, id]
    );
  }, []);

  const handleAssignJob = useCallback((jobIds: string | string[], employeeId: string) => {
    const idsToAssign = Array.isArray(jobIds) ? jobIds : [jobIds];
    
    setJobs(prevJobs => 
      prevJobs.map(job => 
        idsToAssign.includes(job.id)
          ? { ...job, status: 'assigned', assignedEmployeeId: employeeId } 
          : job
      )
    );

    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: 'busy', assignedJobId: idsToAssign[0] } // For simplicity, link to first job
          : emp
      )
    );

    setSelectedJobIds([]);
    setSelectedEmployeeId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-brand-100 selection:text-brand-900">
      {/* Simple Header */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
            <Layout className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Clean<span className="text-brand-600">Flow</span>
            </h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Dispatch Management</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">System Online</span>
          </div>
          
          <div className="h-8 w-px bg-slate-100" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <Users size={18} className="text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">{employees.length} Specialists</span>
              <span className="text-[10px] font-medium text-slate-400">Active Fleet</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Map Section */}
        <div className="flex-1 relative bg-slate-100">
          <Map 
            employees={employees}
            jobs={jobs}
            selectedEmployeeId={selectedEmployeeId}
            selectedJobIds={selectedJobIds}
            onSelectEmployee={handleSelectEmployee}
            onSelectJob={handleSelectJob}
            onAssignJob={handleAssignJob}
          />
          
          {/* Subtle Overlay Grid for "Command Center" feel */}
          <div className="absolute inset-0 pointer-events-none z-[400] opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        {/* Sidebar Panel */}
        <aside className="w-96 flex-shrink-0 z-10 border-l border-slate-100 bg-white">
          <JobPanel 
            employees={employees}
            jobs={jobs}
            selectedEmployeeId={selectedEmployeeId}
            selectedJobIds={selectedJobIds}
            onSelectEmployee={handleSelectEmployee}
            onSelectJob={handleSelectJob}
            onAssignJob={handleAssignJob}
          />
        </aside>
      </main>
    </div>
  );
}
