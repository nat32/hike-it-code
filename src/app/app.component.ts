import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly title = signal('hikes');

  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = this.sidebarOpen ? false : true;
  }
}
