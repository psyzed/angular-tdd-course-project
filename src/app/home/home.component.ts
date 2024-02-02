import { Component } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

}
