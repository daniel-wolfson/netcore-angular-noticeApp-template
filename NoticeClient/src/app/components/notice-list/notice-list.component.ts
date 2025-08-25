import { Component, OnInit, OnDestroy, Output, EventEmitter, effect } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notice } from '../../models/notice.model';
import { NoticeService } from '../../services/notice.service';
import { UserService } from '../../services/user.service';
import { SearchFilterPipe as searchFilter } from '../../pipes/search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NoticeItemComponent } from '../notice-item/notice-item';
import { NoticeFormComponent } from '../notice-form/notice-form.component';
import { EventDataService } from '../../services/data.service';

@Component({
  selector: 'notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss'],
  imports: [searchFilter, CommonModule, NoticeItemComponent, NoticeFormComponent],
})
export class NoticeListComponent implements OnInit, OnDestroy {
  notices: Notice[] = [];
  loading = false;
  filterBy: string = '';
  searchTerm: string = '';
  showNoticeForm = false;
  editingNotice: Notice | null = null;
  currentUser = '';
  error = '';
  windowWidth = window.innerWidth;
  private destroy$ = new Subject<void>();

  searchBarAddNoticeEffect = effect(() => {
    const notice = this.eventDataService.searchBarAddNoticeSignal();
    if (notice) {
      this.onCreateNotice(notice);
    }
  });

  searchBarFilterNoticeEffect = effect(() => {
    const rec = this.eventDataService.searchBarFilterNoticeSignal();
    if (rec && rec['filterBy'] !== undefined && rec['searchTerm'] !== undefined) {
      this.filterBy = rec['filterBy'];
      this.searchTerm = rec['searchTerm'];
    }
  });

  constructor(
    private noticeService: NoticeService,
    private userService: UserService,
    private eventDataService: EventDataService
  ) {}

  ngOnInit(): void {
    this.loadNotices();

    this.userService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user;
    });

    this.noticeService.notices$.pipe(takeUntil(this.destroy$)).subscribe((notices) => {
      this.notices = notices;
      this.loading = false;
    });

    // Listen for window resize
    window.addEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.windowWidth = window.innerWidth;
  };

  get maxColumns() {
    if (this.windowWidth < 600) return 1;
    if (this.windowWidth < 900) return 2;
    if (this.windowWidth < 1200) return 3;
    if (this.windowWidth < 1600) return 4;
    return 6;
  }

  get gridTemplateColumns() {
    const count = this.notices?.length || 1;
    const columns = Math.min(count, this.maxColumns);
    return `repeat(${columns}, 1fr)`;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotices(): void {
    this.loading = true;
    this.error = '';

    this.noticeService
      .getNotices()
      .then(() => {
        this.loading = false;
      })
      .catch((error) => {
        this.error = 'Error loading notices';
        this.loading = false;
        console.error('Error loading notices:', error);
      });
  }

  openEditForm(notice: Notice): void {
    this.editingNotice = notice;
    this.showNoticeForm = true;
  }

  onCloseForm(): void {
    this.showNoticeForm = false;
    this.editingNotice = null;
  }

  onFormSubmit(): void {
    this.onCloseForm();
    this.loadNotices();
  }

  onCreateNotice(notice: Notice): void {
    this.editingNotice = notice;
    this.showNoticeForm = true;
  }

  deleteNotice(notice: Notice): void {
    this.noticeService.deleteNotice(notice.id);
  }
}
