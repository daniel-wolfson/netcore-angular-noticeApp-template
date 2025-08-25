import { Pipe, PipeTransform } from '@angular/core';
import { Notice } from '../models/notice.model';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(notices: Notice[], filterBy: string, searchTerm: string): Notice[] {
    if (!notices) return [];
    let filteredNotices = notices;

    // Apply category filter
    if (filterBy && searchTerm && searchTerm.trim()) {
      const searchValue = searchTerm.trim();

      switch (filterBy) {
        case 'createdAt':
          const daysAgo = parseInt(searchValue);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
          filteredNotices = filteredNotices.filter(
            (notice) => new Date(notice.createdAt) >= cutoffDate
          );
          break;
        case 'location':
          filteredNotices = filteredNotices.filter((notice) =>
            notice.locationInfo?.includes(searchValue)
          );
          break;
        case 'content':
          filteredNotices = filteredNotices.filter((notice) =>
            notice.content.includes(searchValue)
          );
          break;
        default:
          filteredNotices = filteredNotices.filter((notice) =>
            notice[filterBy as keyof Notice]?.toString().includes(searchValue)
          );
          break;
      }
    }

    return filteredNotices;
  }
}
