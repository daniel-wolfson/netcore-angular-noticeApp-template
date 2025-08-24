import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
})
export class AppHeaderComponent {
  currentUser = '';

  constructor(private userService: UserService) {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
