import { Component, ViewChild } from '@angular/core';
import { AppFilterComponent } from '../app-filter/app-filter.component';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { NoticeListComponent } from '../notice-list/notice-list.component';
import { UserService } from '../../services/user.service';
import { Notice } from '../../models/notice.model';
import { NoticeFormComponent } from '../notice-form/notice-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
  imports: [AppFilterComponent, AppHeaderComponent, NoticeListComponent, NoticeFormComponent],
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

  closeForm(): void {
    this.showNoticeForm = false;
  }
}
