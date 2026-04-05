import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Employee, Job } from '../types';
import { User, Briefcase, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

// Fix for default marker icons in Leaflet with Webpack/Vite
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for employees and jobs
const createEmployeeIcon = (status: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative group">
          <div class="absolute -inset-1 bg-white rounded-full blur-[2px] opacity-50"></div>
          <div class="relative w-10 h-10 rounded-2xl border-2 ${status === 'available' ? 'border-green-500 bg-white' : 'border-amber-500 bg-white'} flex items-center justify-center shadow-xl transform transition-all group-hover:scale-110 group-hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${status === 'available' ? 'text-green-600' : 'text-amber-600'}"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${status === 'available' ? 'bg-green-500' : 'bg-amber-500'}"></div>
          </div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const createJobIcon = (priority: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative group">
          <div class="absolute -inset-1 bg-white rounded-lg blur-[2px] opacity-50"></div>
          <div class="relative w-10 h-10 rounded-xl border-2 ${priority === 'high' ? 'border-red-500 bg-white' : priority === 'medium' ? 'border-brand-500 bg-white' : 'border-slate-400 bg-white'} flex items-center justify-center shadow-xl transform transition-all group-hover:scale-110 group-hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-brand-600' : 'text-slate-600'}"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface MapProps {
  employees: Employee[];
  jobs: Job[];
  selectedEmployeeId: string | null;
  selectedJobIds: string[];
  onSelectEmployee: (id: string) => void;
  onSelectJob: (id: string) => void;
  onAssignJob: (jobIds: string[], employeeId: string) => void;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const Map: React.FC<MapProps> = ({ 
  employees, 
  jobs, 
  selectedEmployeeId, 
  selectedJobIds,
  onSelectEmployee,
  onSelectJob,
  onAssignJob
}) => {
  const center: [number, number] = [40.75, -73.98]; // NYC Center

  const handlePopupAssign = (jobIds: string[], employeeId: string) => {
    onAssignJob(jobIds, employeeId);
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {employees.map((employee) => (
          <Marker 
            key={employee.id} 
            position={[employee.location.lat, employee.location.lng]}
            icon={createEmployeeIcon(employee.status)}
            eventHandlers={{
              click: () => onSelectEmployee(employee.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-4 min-w-[200px] font-sans">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 m-0 leading-tight">{employee.name}</h3>
                    <p className="text-[10px] text-slate-400 m-0 uppercase font-bold tracking-widest mt-1">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 mb-4 bg-slate-50 p-2 rounded-xl">
                  <MapPin size={12} className="text-brand-500" />
                  <span className="truncate">{employee.location.address}</span>
                </div>
                
                {selectedJobIds.length > 0 && employee.status === 'available' ? (
                  <button 
                    onClick={() => handlePopupAssign(selectedJobIds, employee.id)}
                    className="w-full bg-brand-600 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                  >
                    Assign {selectedJobIds.length} Job(s)
                  </button>
                ) : (
                  <div className={`text-[9px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${employee.status === 'available' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                    <div className={`w-1 h-1 rounded-full ${employee.status === 'available' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    {employee.status.toUpperCase()}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {jobs.filter(j => j.status === 'unassigned').map((job) => {
          const isSelected = selectedJobIds.includes(job.id);
          return (
            <Marker 
              key={job.id} 
              position={[job.location.lat, job.location.lng]}
              icon={createJobIcon(job.priority)}
              eventHandlers={{
                click: () => onSelectJob(job.id),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 min-w-[200px] font-sans">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-slate-900 m-0 tracking-tight">{job.title}</h3>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                      job.priority === 'high' ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"
                    )}>
                      {job.priority}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 mb-4 leading-relaxed">{job.description}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 mb-4 bg-slate-50 p-2 rounded-xl">
                    <MapPin size={12} className="text-brand-500" />
                    <span className="truncate">{job.location.address}</span>
                  </div>

                  {selectedEmployeeId ? (
                    <button 
                      onClick={() => handlePopupAssign([job.id], selectedEmployeeId)}
                      className="w-full bg-brand-600 text-white text-[10px] font-bold py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                    >
                      Dispatch to {employees.find(e => e.id === selectedEmployeeId)?.name.split(' ')[0]}
                    </button>
                  ) : (
                    <div className="text-[10px] font-medium text-slate-400 text-center py-2 border-t border-slate-50 mt-2">
                      Select a specialist to dispatch
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
