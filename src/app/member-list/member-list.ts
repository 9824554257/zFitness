import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';

@Component({
  selector: 'app-member-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
  standalone: true,
})
export class MemberList implements OnInit {
  constructor(
    private appService: AppService,
    public sharedService : SharedService
  ) {

  }

  ngOnInit(): void {
    this.fetchMemberDetails();
  }

  fetchMemberDetails() {
    this.appService.getAllMemberDetails().subscribe((data : any) => {
      if(!this.sharedService.checkIfValueIsEmpty(data)) {
        this.sharedService.memberDetails = data;
      }
    },
   (error : any) => {

   })
  }
}
