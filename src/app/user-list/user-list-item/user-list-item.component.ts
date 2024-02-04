import { Component, Input } from '@angular/core';
import { User } from '../../core/user.model';

@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss',
})
export class UserListItemComponent {
  @Input() user!: User;
}
