import { Pipe, PipeTransform } from '@angular/core';
import { Notice } from '../models/notice.model';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(notices: Notice[], searchTerm: string, filterBy: string, filterValue: string): Notice[] {
    if (!notices) return [];

    let filteredNotices = notices;

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filteredNotices = filteredNotices.filter(notice =>
        notice.title.toLowerCase().includes(search) ||
        notice.content.toLowerCase().includes(search) ||
        notice.author.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (filterBy && filterValue && filterValue !== 'all') {
      switch (filterBy) {
        case 'author':
          if (filterValue === 'my') {
            const currentUser = localStorage.getItem('currentUser') || 'משתמש דמו';
            filteredNotices = filteredNotices.filter(notice => notice.author === currentUser);
          } else {
            filteredNotices = filteredNotices.filter(notice => notice.author === filterValue);
          }
          break;
        case 'recent':
          const daysAgo = parseInt(filterValue);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
          filteredNotices = filteredNotices.filter(notice => 
            new Date(notice.createdAt) >= cutoffDate
          );
          break;
        case 'location':
          if (filterValue === 'with-location') {
            filteredNotices = filteredNotices.filter(notice => notice.location);
          }
          break;
      }
    }

    return filteredNotices;
  }
}