import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@shared/toast/toast.component';
import { TopNavbarComponent, FooterComponent } from '@components/layout';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastComponent, TopNavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
