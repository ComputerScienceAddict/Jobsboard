export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  location: Location;
  status: 'available' | 'busy';
  assignedJobId?: string;
  avatar: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: Location;
  status: 'unassigned' | 'assigned' | 'completed';
  assignedEmployeeId?: string;
  priority: 'low' | 'medium' | 'high';
}
