import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<string>('demoUser'); // Demo User
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Load from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      localStorage.setItem('currentUser', 'demoUser');
    }
    this.currentUserSubject.next(savedUser!);
  }

  getCurrentUser(): string {
    return this.currentUserSubject.value;
  }

  setCurrentUser(username: string): void {
    this.currentUserSubject.next(username);
    localStorage.setItem('currentUser', username);
  }

  isMyNotice(notice: any): boolean {
    return notice.author === this.getCurrentUser();
  }
}
