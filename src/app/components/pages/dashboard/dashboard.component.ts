import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@interfaces/project.interface';
import { ProjectsGridComponent } from '@components/features/projects-grid/projects-grid.component';
import { ProjectsListComponent } from '@components/features/projects-list/projects-list.component';
import { ProjectFormComponent } from '@components/features/project-form/project-form.component';
import { formatCurrency } from '@utils/misc/helper';
import { ModalService } from '@shared/modal/modal.service';

const DummyProjects = [
  {
    id: 1,
    projectName: 'Project 1',
    updatedAt: '2025-05-23T18:44:40.844081',
    completionPct: 71,
    company: 'Company 1',
    revenue: 2806389,
    country: 'South Korea',
    currency: 'KRW',
    users: [
      { id: 16, name: 'User Q', email: 'user16@example.com' },
      { id: 25, name: 'User Z', email: 'user25@example.com' },
    ],
    industry: 'Logistics',
    status: 'Planning',
    priority: 'Low',
    dueDate: '2025-07-10',
    tags: ['Security', 'Compliance'],
    teamSize: 18,
    taskCount: 52,
    processCount: 4,
  },
  {
    id: 2,
    projectName: 'Project 2',
    updatedAt: '2025-05-19T18:44:40.844165',
    completionPct: 82,
    company: 'Company 2',
    revenue: 2144353,
    country: 'Canada',
    currency: 'CAD',
    users: [
      { id: 11, name: 'User L', email: 'user11@example.com' },
      { id: 8, name: 'User H', email: 'user8@example.com' },
      { id: 24, name: 'User Y', email: 'user24@example.com' },
    ],
    industry: 'Marketing',
    status: 'QA Testing',
    priority: 'High',
    dueDate: '2025-06-28',
    tags: ['Analytics'],
    teamSize: 16,
    taskCount: 80,
    processCount: 7,
  },
  {
    id: 3,
    projectName: 'Project 3',
    updatedAt: '2025-05-17T18:44:40.844196',
    completionPct: 76,
    company: 'Company 3',
    revenue: 3839384,
    country: 'Australia',
    currency: 'AUD',
    users: [
      { id: 7, name: 'User G', email: 'user7@example.com' },
      { id: 9, name: 'User I', email: 'user9@example.com' },
    ],
    industry: 'Legal',
    status: 'QA Testing',
    priority: 'High',
    dueDate: '2025-07-18',
    tags: ['LegalTech'],
    teamSize: 14,
    taskCount: 81,
    processCount: 5,
  },
  {
    id: 4,
    projectName: 'Project 4',
    updatedAt: '2025-05-14T18:44:40.844208',
    completionPct: 56,
    company: 'Company 4',
    revenue: 4870751,
    country: 'South Korea',
    currency: 'KRW',
    users: [{ id: 5, name: 'User E', email: 'user5@example.com' }],
    industry: 'Retail',
    status: 'Final Review',
    priority: 'Low',
    dueDate: '2025-08-01',
    tags: ['3D', 'Retail'],
    teamSize: 10,
    taskCount: 29,
    processCount: 2,
  },
  {
    id: 5,
    projectName: 'Project 5',
    updatedAt: '2025-05-19T18:44:40.844219',
    completionPct: 74,
    company: 'Company 5',
    revenue: 2787268,
    country: 'South Korea',
    currency: 'KRW',
    users: [
      { id: 6, name: 'User F', email: 'user6@example.com' },
      { id: 3, name: 'User C', email: 'user3@example.com' },
      { id: 21, name: 'User V', email: 'user21@example.com' },
    ],
    industry: 'Healthcare',
    status: 'Development',
    priority: 'High',
    dueDate: '2025-06-29',
    tags: ['Security', 'Compliance'],
    teamSize: 13,
    taskCount: 89,
    processCount: 4,
  },
  {
    id: 6,
    projectName: 'Project 6',
    updatedAt: '2025-05-21T18:44:40.844230',
    completionPct: 91,
    company: 'Company 6',
    revenue: 3603087,
    country: 'Canada',
    currency: 'CAD',
    users: [
      { id: 22, name: 'User W', email: 'user22@example.com' },
      { id: 23, name: 'User X', email: 'user23@example.com' },
      { id: 6, name: 'User F', email: 'user6@example.com' },
      { id: 11, name: 'User L', email: 'user11@example.com' },
      { id: 15, name: 'User O', email: 'user15@example.com' },
    ],
    industry: 'Legal',
    status: 'Polishing',
    priority: 'Medium',
    dueDate: '2025-08-15',
    tags: ['LegalTech'],
    teamSize: 19,
    taskCount: 73,
    processCount: 10,
  },
  {
    id: 7,
    projectName: 'Project 7',
    updatedAt: '2025-05-15T18:44:40.844242',
    completionPct: 56,
    company: 'Company 7',
    revenue: 3478742,
    country: 'Netherlands',
    currency: 'EUR',
    users: [
      { id: 8, name: 'User H', email: 'user8@example.com' },
      { id: 17, name: 'User R', email: 'user17@example.com' },
    ],
    industry: 'Healthcare',
    status: 'Development',
    priority: 'Medium',
    dueDate: '2025-07-13',
    tags: ['Security', 'Compliance'],
    teamSize: 8,
    taskCount: 35,
    processCount: 4,
  },
  {
    id: 8,
    projectName: 'Project 8',
    updatedAt: '2025-05-14T18:44:40.844253',
    completionPct: 41,
    company: 'Company 8',
    revenue: 2176072,
    country: 'Singapore',
    currency: 'SGD',
    users: [{ id: 6, name: 'User F', email: 'user6@example.com' }],
    industry: 'Legal',
    status: 'Planning',
    priority: 'Medium',
    dueDate: '2025-06-24',
    tags: ['LegalTech'],
    teamSize: 7,
    taskCount: 44,
    processCount: 5,
  },
  {
    id: 9,
    projectName: 'Project 9',
    updatedAt: '2025-05-22T18:44:40.844264',
    completionPct: 54,
    company: 'Company 9',
    revenue: 3131652,
    country: 'Germany',
    currency: 'EUR',
    users: [{ id: 13, name: 'User N', email: 'user13@example.com' }],
    industry: 'Education',
    status: 'Final Review',
    priority: 'Critical',
    dueDate: '2025-06-07',
    tags: ['Education', 'LMS'],
    teamSize: 20,
    taskCount: 71,
    processCount: 8,
  },
  {
    id: 10,
    projectName: 'Project 10',
    updatedAt: '2025-05-16T18:44:40.844276',
    completionPct: 40,
    company: 'Company 10',
    revenue: 1191038,
    country: 'Singapore',
    currency: 'SGD',
    users: [
      { id: 14, name: 'User M', email: 'user14@example.com' },
      { id: 6, name: 'User F', email: 'user6@example.com' },
      { id: 19, name: 'User T', email: 'user19@example.com' },
      { id: 22, name: 'User W', email: 'user22@example.com' },
    ],
    industry: 'IoT',
    status: 'QA Testing',
    priority: 'Low',
    dueDate: '2025-06-15',
    tags: ['Hardware', 'IoT'],
    teamSize: 17,
    taskCount: 95,
    processCount: 3,
  },
  {
    id: 11,
    projectName: 'Project 11',
    updatedAt: '2025-05-18T18:44:40.844287',
    completionPct: 64,
    company: 'Company 11',
    revenue: 1220655,
    country: 'Netherlands',
    currency: 'EUR',
    users: [
      { id: 1, name: 'User A', email: 'user1@example.com' },
      { id: 18, name: 'User S', email: 'user18@example.com' },
      { id: 20, name: 'User U', email: 'user20@example.com' },
      { id: 9, name: 'User I', email: 'user9@example.com' },
    ],
    industry: 'IoT',
    status: 'Research',
    priority: 'Medium',
    dueDate: '2025-07-19',
    tags: ['Hardware', 'IoT'],
    teamSize: 14,
    taskCount: 55,
    processCount: 7,
  },
  {
    id: 12,
    projectName: 'Project 12',
    updatedAt: '2025-05-17T18:44:40.844298',
    completionPct: 20,
    company: 'Company 12',
    revenue: 4228876,
    country: 'Estonia',
    currency: 'EUR',
    users: [{ id: 21, name: 'User V', email: 'user21@example.com' }],
    industry: 'Retail',
    status: 'Planning',
    priority: 'Critical',
    dueDate: '2025-07-27',
    tags: ['3D', 'Retail'],
    teamSize: 5,
    taskCount: 61,
    processCount: 6,
  },
];

@Component({
  selector: 'app-dashboard',
  imports: [ProjectsGridComponent, ProjectsListComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [ModalService],
})
export class DashboardComponent {
  loading = signal(true);
  items = signal<Project[]>([]);

  viewAs: 'grid' | 'list' = 'grid';

  /** Add Project modal props */

  modalVisible = false;
  modalTitle = '';
  modalContent: any = null;

  constructor(private modal: ModalService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    const mappedData = DummyProjects.map(
      (project) =>
        ({
          ...project,
          valuation: formatCurrency(project.revenue, project.currency),
        }) as Project,
    );
    setTimeout(() => {
      this.items.set(mappedData);
      this.loading.set(false);
    }, 2000);
  }

  openProjectModal() {
    this.modal.open(
      ProjectFormComponent,
      { name: 'Manoj' },
      {
        submitted: (value) => {
          console.log('Submitted:', value);
        },
      },
      {
        title: 'User Form',
        size: 'small',
        showFooter: false,
      },
    );
  }
}
