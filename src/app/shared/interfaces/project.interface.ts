export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  projectName: string;
  updatedAt: string; // ISO date string
  completionPct: number;
  company: string;
  revenue: number;
  country: string;
  currency: string;
  users: User[];
  industry: string;
  status: string;
  priority: string;
  dueDate: string; // ISO date string
  tags: string[];
  teamSize: number;
  taskCount: number;
  processCount: number;
  valuation?: string;
}
