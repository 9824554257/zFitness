import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-misc-master',
  imports: [CommonModule, RouterModule],
  templateUrl: './misc-master.html',
  styleUrl: './misc-master.css',
  standalone: true,
})
export class MiscMaster {}
