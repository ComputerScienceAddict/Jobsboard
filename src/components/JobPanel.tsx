import React from 'react';
import { Employee, Job } from '../types';
import { User, Briefcase, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface JobPanelProps {
  employees: Employee[];
  jobs: Job[];
  selectedEmployeeId: string | null;
  selectedJobIds: string[];
  onSelectEmployee: (id: string) => void;
  onSelectJob: (id: string) => void;
  onAssignJob: (jobIds: string[], employeeId: string) => void;
}

const JobPanel: React.FC<JobPanelProps> = ({
  employees,
  jobs,
  selectedEmployeeId,
  selectedJobIds,
  onSelectEmployee,
  onSelectJob,
  onAssignJob,
}) => {
  const unassignedJobs = jobs.filter((j) => j.status === 'unassigned');
  
  const handleJobClick = (jobId: string) => {
    onSelectJob(jobId);
  };

  const handleEmployeeClick = (employeeId: string, status: string) => {
    if (status === 'busy') return;
    onSelectEmployee(employeeId);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden font-sans">
      {/* Panel Header */}
      <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Queue Overview</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-500 rounded-full" />
              <span className="text-sm font-bold text-slate-900 tracking-tight">Active Dispatch</span>
            </div>
          </div>
          {(selectedJobIds.length > 0 || selectedEmployeeId) && (
            <button 
              onClick={() => { 
                selectedJobIds.forEach(id => onSelectJob(id)); 
                onSelectEmployee(''); 
              }}
              className="text-[10px] font-bold text-slate-400 hover:text-brand-600 transition-colors uppercase tracking-widest"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* 1. THE JOB POOL (Unassigned) */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-slate-400" />
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Open Tickets</h3>
            </div>
            <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              {unassignedJobs.length.toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="space-y-3">
            {unassignedJobs.map((job) => {
              const isSelected = selectedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job.id)}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer group relative",
                    isSelected 
                      ? "border-brand-500 bg-brand-50/50" 
                      : "border-slate-100 bg-white hover:border-brand-200 hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className={cn("font-bold text-sm tracking-tight", isSelected ? "text-brand-900" : "text-slate-900")}>
                      {job.title}
                    </h4>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                      isSelected 
                        ? "bg-brand-100 text-brand-700" 
                        : job.priority === 'high' ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {job.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <MapPin size={12} />
                      <span className="truncate max-w-[160px]">{job.location.address}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={16} className="text-brand-600" />}
                  </div>
                </div>
              );
            })}
            {unassignedJobs.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="text-slate-300" size={20} />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Queue Empty</p>
              </div>
            )}
          </div>
        </section>

        {/* 2. THE TEAM (Unified View) */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Cleaning Crew</h3>
            </div>
            <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              {employees.length.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="space-y-4">
            {employees.map((employee) => {
              const activeJobs = jobs.filter(j => j.assignedEmployeeId === employee.id);
              const isSelected = selectedEmployeeId === employee.id;
              
              return (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee.id, employee.status)}
                  className={cn(
                    "p-6 rounded-2xl border transition-all cursor-pointer group relative",
                    isSelected 
                      ? "border-brand-500 bg-brand-50/30" 
                      : employee.status === 'busy' 
                        ? "border-slate-50 bg-slate-50/30 opacity-50" 
                        : "border-slate-100 bg-white hover:border-brand-200 hover:bg-slate-50/50"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={employee.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                        employee.status === 'available' ? "bg-green-500" : "bg-amber-500"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{employee.name}</p>
                        {employee.status === 'available' && (
                          <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Available</span>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest truncate">{employee.role}</p>
                    </div>
                  </div>

                  {/* Nested Jobs Component */}
                  {activeJobs.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                      {activeJobs.map(job => (
                        <div key={job.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
                            <Briefcase size={14} className="text-brand-500" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-slate-700 truncate">{job.title}</p>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 mt-1">
                              <Clock size={12} />
                              <span>In Progress</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assignment Call to Action */}
                  {isSelected && activeJobs.length === 0 && (
                    <div className="mt-6 py-3 px-4 bg-brand-600 rounded-xl text-center">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest">Select Jobs to Dispatch</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Streamlined Footer Action */}
      {selectedJobIds.length > 0 && selectedEmployeeId && (
        <div className="p-8 bg-white border-t border-slate-100 animate-in slide-in-from-bottom-full duration-500">
          <button
            onClick={() => onAssignJob(selectedJobIds, selectedEmployeeId)}
            className="w-full bg-brand-600 text-white font-bold py-5 rounded-2xl hover:bg-brand-700 shadow-lg shadow-brand-100 transition-all flex items-center justify-center gap-3 group"
          >
            <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-widest uppercase text-sm">Confirm Dispatch</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobPanel;
