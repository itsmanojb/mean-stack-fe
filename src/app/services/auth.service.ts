import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  hasAccess() {
    return false; // Replace with actual authentication logic
  }

  constructor() {}
}
