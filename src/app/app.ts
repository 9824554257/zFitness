import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedService } from './shared-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gymProject');
  constructor(public sharedService: SharedService) {}

  hideMenu() {
    return false; //window.location.href.includes('login');
  }
}
