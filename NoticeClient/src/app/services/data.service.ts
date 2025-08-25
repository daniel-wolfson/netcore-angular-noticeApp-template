import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Notice } from '../models/notice.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class EventDataService {
  // Signal to maintain communication between notice-list and search-bar components
  private searchBarAddSignal = signal<Notice | null>(null);
  private searchBarFilterSignal = signal<Record<string, string> | null>(null);

  // Read-only access to the search query
  readonly searchBarAddNoticeSignal = this.searchBarAddSignal.asReadonly();
  readonly searchBarFilterNoticeSignal = this.searchBarFilterSignal.asReadonly();
  currentUser!: string;

  constructor(private userService: UserService) {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  addNotice(): void {
    const query: Notice = {
      id: '',
      title: '',
      content: '',
      author: this.currentUser,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };
    this.searchBarAddSignal.set(query);
  }

  // Method to update the search query from search-bar component
  filterNotice(filterBy: string, searchTerm: string): void {
    this.searchBarFilterSignal.set({ filterBy: filterBy, searchTerm: searchTerm });
  }

  // Method to clear the search query
  clearSearchQuery(): void {
    this.searchBarAddSignal.set(null);
  }
}
