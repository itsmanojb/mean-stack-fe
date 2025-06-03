import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  public readonly breadcrumbs$ = this._breadcrumbs.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs = this.buildBreadcrumbs(root);
      this._breadcrumbs.next(breadcrumbs);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const routeURL = route.url.map((segment) => segment.path).join('/');
    if (route.routeConfig && route.routeConfig.path !== '') {
      url += `/${routeURL}`;
    }

    let label: string | null = null;

    const breadcrumbData = route.data?.['breadcrumb'];
    try {
      label =
        typeof breadcrumbData === 'function'
          ? breadcrumbData(route)
          : typeof breadcrumbData === 'string'
            ? breadcrumbData
            : routeURL
              ? this.formatLabel(routeURL)
              : 'Home';
    } catch {
      label = '[Invalid Label]';
    }

    if (label) {
      breadcrumbs.push({ label, url: url || '/' });
    }

    for (const child of route.children) {
      this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private formatLabel(str: string): string {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
