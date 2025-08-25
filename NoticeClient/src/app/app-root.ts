import { Component, ViewChild } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { NoticeListComponent } from './components/notice-list/notice-list.component';
import { UserService } from './services/user.service';
import { Notice } from './models/notice.model';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.html',
  imports: [SearchBarComponent, AppHeaderComponent, NoticeListComponent],
})
export class AppHomeComponent {
  showNoticeForm = false;
  editingNotice: Notice | null = null;
  currentUser = '';
  @ViewChild(NoticeListComponent) noticeListRef: NoticeListComponent | null = null;

  constructor(private userService: UserService) {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  onFormSubmit(): void {
    this.showNoticeForm = false;
    this.noticeListRef?.loadNotices();
  }

  openEditForm(notice: Notice): void {
    this.editingNotice = notice;
    this.showNoticeForm = true;
  }

  closeForm(): void {
    this.showNoticeForm = false;
  }
}
