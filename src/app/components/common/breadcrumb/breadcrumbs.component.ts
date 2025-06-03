import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Breadcrumb, NavigationService } from '@services/navigation.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  @Input() separator: string = '/';
  @Input() maxVisible = 2;
  @Input() autoExpandWidth = 768;

  expanded = false;
  breadcrumbs$ = this.navService.breadcrumbs$;
  private resizeObserver: ResizeObserver | null = null;
  private sub = new Subscription();

  constructor(
    private navService: NavigationService,
    private host: ElementRef<HTMLElement>,
  ) {}

  ngOnInit() {
    this.setExpandedByWidth();

    this.resizeObserver = new ResizeObserver(() => {
      this.setExpandedByWidth();
    });

    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.sub.unsubscribe();
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  setExpandedByWidth() {
    const width = window.innerWidth;
    this.expanded = width >= this.autoExpandWidth;
  }

  getVisible(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    if (this.expanded || breadcrumbs.length <= this.maxVisible) {
      return breadcrumbs;
    }

    const first = breadcrumbs[0];
    const lastItems = this.maxVisible > 2 ? breadcrumbs.slice(-2) : breadcrumbs.slice(-1);
    return [first, ...lastItems];
  }

  shouldCollapse(breadcrumbs: Breadcrumb[]): boolean {
    return !this.expanded && breadcrumbs.length > this.maxVisible;
  }
}
