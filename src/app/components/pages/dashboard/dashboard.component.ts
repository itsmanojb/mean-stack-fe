import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@interfaces/project.interface';
import { ProjectsGridComponent } from '@components/features/projects-grid/projects-grid.component';
import { ProjectsListComponent } from '@components/features/projects-list/projects-list.component';
import { ProjectFormComponent } from '@components/features/project-form/project-form.component';
import { CommonModalService } from '@app/shared/common-modal/common-modal.service';
import { ToastService } from '@shared/toast/toast.service';
import { TooltipDirective } from '@shared/tooltip/tooltip.directive';
import { SelectComponent, SelectItem } from '@app/components/common/select-input/select-input.component';
import { ListboxComponent } from '@components/common/listbox/listbox.component';
import { DummyDataService } from '@app/data/dummy-data.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ProjectsGridComponent,
    ProjectsListComponent,
    TooltipDirective,
    SelectComponent,
    ListboxComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  loading = signal(true);
  items = signal<Project[]>([]);

  viewAs: 'grid' | 'list' = 'grid';

  /** Add Project modal props */

  modalVisible = false;
  modalTitle = '';
  modalContent: any = null;

  favFruits: SelectItem[] = [];

  constructor(
    private modal: CommonModalService,
    private toast: ToastService,
    private data: DummyDataService,
  ) {}

  ngOnInit() {
    this.loadData();
    /* this.data.getFruitsByValues([]).subscribe((data) => {
      this.favFruits = data;
    }); */
  }

  loadData() {
    this.loading.set(true);
    this.data.getProjects().subscribe(
      (results) => {
        this.items.set(results);
        this.loading.set(false);
      },
      (err) => {
        this.toast.error(err.message || 'An error occurred.');
        this.loading.set(false);
      },
    );
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

  myItems: SelectItem[] = [
    {
      label: 'Alice Johnson',
      value: { id: 1, name: 'Alice Johnson', role: 'Admin' },
      group: 'Team A',
    },
    {
      label: 'Bob Smith',
      value: { id: 2, name: 'Bob Smith', role: 'Editor' },
      group: 'Team A',
    },
    {
      label: 'Charlie Adams',
      value: { id: 3, name: 'Charlie Adams', role: 'Viewer' },
      group: 'Team B',
    },
    {
      label: 'Diana Prince',
      value: { id: 4, name: 'Diana Prince', role: 'Admin' },
      group: 'Team B',
    },
  ];

  onValueChange(e: any) {
    console.log('e', e);
  }

  loadingFruits = false;
  fruitsError = null;
  filteredFruits: SelectItem[] = [];
  defaultFruits: SelectItem[] = [
    { label: 'Strawberry', value: 'strawberry' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Raspberry', value: 'raspberry' },
  ];

  pageSize = 10;
  currentPage = 1;
  totalCount = 0;
  isLoadingMore = false;

  onSearch({ term, page }: { term: string; page: number }) {
    if (page === 1) {
      this.loadingFruits = true;
    } else {
      this.isLoadingMore = true;
    }
    this.data.searchFruits(term, page, this.pageSize).subscribe({
      next: (result) => {
        this.totalCount = result.totalCount;
        if (page === 1) {
          this.filteredFruits = result.items;
        } else {
          this.filteredFruits = [...this.filteredFruits, ...result.items];
        }
        this.loadingFruits = false;
        this.isLoadingMore = false;
        this.currentPage = page;
      },
      error: (err) => {
        this.fruitsError = err.message || 'Search failed';
        this.loadingFruits = false;
        this.isLoadingMore = false;
      },
    });
  }

  onListItemSelect(e: any) {
    console.log('Selected from listbox', e);
  }
}
