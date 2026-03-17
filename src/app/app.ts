import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedService } from './shared-service';
import { LoaderService } from './loader-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('gymProject');

  constructor(
    public sharedService: SharedService,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {}

  hideMenu() {
    return false; //window.location.href.includes('login');
  }
}
