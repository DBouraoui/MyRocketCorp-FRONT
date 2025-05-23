import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../user/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './user.component.html',
})
export class UserComponent {}
