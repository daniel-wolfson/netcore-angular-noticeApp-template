// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { Notice } from '../../../models/notice.model';
// import { NoticeService } from '../../../services/notice.service';
// import { UserService } from '../../../services/user.service';

// @Component({
//   selector: 'app-notice-list',
//   templateUrl: './notice-list.component.html',
//   styleUrls: ['./notice-list.component.scss']
// })
// export class NoticeListComponent implements OnInit, OnDestroy {
//   notices: Notice[] = [];
//   loading = false;
//   error = '';
//   searchTerm = '';
//   filterBy = 'all';
//   filterValue = 'all';
//   showForm = false;
//   editingNotice: Notice | null = null;
//   currentUser = '';

//   // Filter options
//   filterOptions = [
//     { value: 'all', label: 'הכל' },
//     { value: 'my', label: 'המודעות שלי' },
//     { value: 'recent-7', label: 'שבוע אחרון' },
//     { value: 'recent-30', label: 'חודש אחרון' },
//     { value: 'with-location', label: 'עם מיקום' }
//   ];

//   private destroy$ = new Subject<void>();

//   constructor(
//     private noticeService: NoticeService,
//     private userService: UserService
//   ) {}

//   ngOnInit(): void {
//     this.loadNotices();

//     this.userService.currentUser$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(user => {
//         this.currentUser = user;
//       });

//     this.noticeService.notices$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(notices => {
//         this.notices = notices;
//         this.loading = false;
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   loadNotices(): void {
//     this.loading = true;
//     this.error = '';

//     this.noticeService.getNotices().subscribe({
//       next: () => {
//         this.loading = false;
//       },
//       error: (error) => {
//         this.error = 'שגיאה בטעינת המודעות';
//         this.loading = false;
//         console.error('Error loading notices:', error);
//       }
//     });
//   }

//   onSearchChange(event: any): void {
//     this.searchTerm = event.target.value;
//   }

//   onFilterChange(event: any): void {
//     const value = event.target.value;

//     if (value === 'all') {
//       this.filterBy = 'all';
//       this.filterValue = 'all';
//     } else if (value === 'my') {
//       this.filterBy = 'author';
//       this.filterValue = 'my';
//     } else if (value.startsWith('recent-')) {
//       this.filterBy = 'recent';
//       this.filterValue = value.split('-')[1];
//     } else if (value === 'with-location') {
//       this.filterBy = 'location';
//       this.filterValue = 'with-location';
//     }
//   }

//   openCreateForm(): void {
//     this.editingNotice = null;
//     this.showForm = true;
//   }

//   openEditForm(notice: Notice): void {
//     this.editingNotice = notice;
//     this.showForm = true;
//   }

//   closeForm(): void {
//     this.showForm = false;
//     this.editingNotice = null;
//   }

//   onFormSubmit(): void {
//     this.closeForm();
//     this.loadNotices();
//   }

//   deleteNotice(notice: Notice): void {
//     if (!this.userService.isMyNotice(notice)) {
//       alert('ניתן למחוק רק מודעות שיצרת בעצמך');
//       return;
//     }

//     if (confirm(`האם אתה בטוח שברצונך למחוק את המודעה "${notice.title}"?`)) {
//       this.noticeService.deleteNotice(notice.id).subscribe({
//         next: () => {
//           // Notice will be refreshed automatically through the service
//         },
//         error: (error) => {
//           alert('שגיאה במחיקת המודעה');
//           console.error('Error deleting notice:', error);
//         }
//       });
//     }
//   }

//   canEditOrDelete(notice: Notice): boolean {
//     return this.userService.isMyNotice(notice);
//   }

//   formatDate(dateString: string): string {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('he-IL', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   }
// }
