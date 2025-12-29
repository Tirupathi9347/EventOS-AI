
export type UserRole = 'ADMIN' | 'TEAM' | 'USER';

export interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
  budget: number;
  spent: number;
  status: 'Upcoming' | 'Completed' | 'Draft' | 'Pending_Approval' | 'Rejected';
  attendees?: number;
  registeredCount?: number;
  organizerId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: 'Food' | 'Decoration' | 'Venue' | 'Sound' | 'Photography';
  rating: number;
  costEstimate: string;
  image: string;
  description?: string;
  reviews?: number;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category?: string;
  assignedTo?: string;
}

export type ViewState = 
  | 'HOME' 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'DASHBOARD' 
  | 'PAST_EVENTS' 
  | 'CREATE_EVENT' 
  | 'BUDGET' 
  | 'CHECKLIST' 
  | 'VENDORS' 
  | 'BATCH_DASHBOARD'
  | 'TEAM'
  | 'GALLERY'
  | 'IDEAS'
  | 'REPORT'
  | 'ADMIN_APPROVALS'
  | 'USER_CATALOG';

export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  time: string;
  read: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'Busy';
  tasks: number;
}

export interface FundEntry {
  id: string;
  source: string;
  amount: number;
  status: 'Received' | 'Pending';
  date: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  votes: number;
  author: string;
  category: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  forecast: string;
}
