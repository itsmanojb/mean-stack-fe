import { Component } from '@angular/core';
import { DataTableComponent, TableColumn } from '@components/common/data-table/data-table.component';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Users } from '../../../data/user-data';
import { DummyDataService } from '@app/data/dummy-data.service';

@Component({
  selector: 'app-jobs-library',
  imports: [PageHeadingComponent, ButtonComponent, DataTableComponent, FormsModule, NgFor],
  templateUrl: './jobs-library.component.html',
  styleUrl: './jobs-library.component.scss',
})
export class JobsLibraryComponent {
  loading = true;
  data: any[] = [];
  userColumns: TableColumn[] = [
    { header: 'Name', field: 'name', sortable: true, fixed: true, visible: true, filterable: true },
    { header: 'Email', field: 'email', sortable: true, visible: true, filterable: true },
    {
      header: 'Role',
      field: 'role',
      visible: true,
      filterable: true,
      filterType: 'multi-select',
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' },
      ],
    },
    { header: 'Dept.', field: 'department', visible: true, filterable: true },
    { header: 'Address', field: 'address', visible: true },
    { header: 'Phone', field: 'phone', visible: true },
    { header: 'Skills', field: 'skills', visible: true },
    { header: 'Last Login', field: 'lastLogin', visible: true },
    { header: 'Active', field: 'isActive', visible: true, filterable: true },
  ];

  constructor(private _data: DummyDataService) {}

  ngOnInit() {
    this._data.getUsers().subscribe((data) => {
      this.data = data;
      this.loading = false;
    });
  }

  onColumnFilters(filters: Record<string, string | string[]>) {
    this._data.getUsers(filters).subscribe((data) => (this.data = data));
  }

  onSortChanged(event: { field: string | null; direction: 'asc' | 'desc' }) {
    if (!event.field) return;

    this.data = [...this.data].sort((a: any, b: any) => {
      const valA = a[event.field!];
      const valB = b[event.field!];

      if (valA == null) return 1;
      if (valB == null) return -1;

      const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
      return event.direction === 'asc' ? comparison : -comparison;
    });
  }

  editUser(row: any) {}

  deleteUser(row: any) {}

  shouldExpand(row: any, index: number): boolean {
    return row.role === 'admin';
  }
}
