import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notice } from '../../models/notice.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'notice-item',
  templateUrl: './notice-item.html',
  styleUrls: ['./notice-item.css'],
})
export class NoticeItemComponent {
  constructor(private userService: UserService) {}

  @Output() deleteNoticeEvent = new EventEmitter<Notice>();
  @Output() editNoticeEvent = new EventEmitter<Notice>();
  @Input() notice!: Notice;

  editNotice(notice: Notice): void {
    this.editNoticeEvent.emit(notice);
  }

  deleteNotice(notice: Notice): void {
    if (!this.userService.isMyNotice(notice)) {
      alert('You can only delete notices you created yourself');
      return;
    }

    if (confirm(`Are you sure you want to delete the notice "${notice.title}"?`)) {
      this.deleteNoticeEvent.emit(notice);
    }
  }

  canEditOrDelete(notice: Notice): boolean {
    return this.userService.isMyNotice(notice);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
