import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import { LoaderService } from '../loader-service';

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
    public sharedService: SharedService,
    public router: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.fetchMemberDetails();
  }

  fetchMemberDetails() {
    this.loaderService.show.set(true);
    this.appService.getAllMemberDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.memberDetails.set(data['data']);
          this.loaderService.show.set(false);
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  editMemberDetails(member: any) {
    this.router.navigate(['/newMember']);
    this.sharedService.savedMemberDataResponse.set(member);
  }

  deleteMember(member : any) {
    this.loaderService.show.set(true);
    this.appService.deleteMemberDetails(member._id).subscribe((data : any) => {
      this.loaderService.show.set(false);
      // let deltedIndex : any = this.sharedService.memberDetails().findIndex((singleObj : any) => singleObj._id === member._id);
      // if(deltedIndex !== -1) {
        this.sharedService.memberDetails.set(
          this.sharedService.memberDetails().filter((item: any) => item._id !== member._id)
        );
        // this.cdr.detectChanges();
      // }
    }, (err : any) => {
      this.loaderService.show.set(false);
    })
  }
}
