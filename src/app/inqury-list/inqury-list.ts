import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppService } from '../app-service';
import { LoaderService } from '../loader-service';
import { SharedService } from '../shared-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inqury-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './inqury-list.html',
  styleUrl: './inqury-list.css',
})
export class InquryList implements OnInit {
  constructor(
    private appService: AppService,
    public loaderService: LoaderService,
    public sharedService: SharedService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchAllInquiryDetails();
  }

  fetchAllInquiryDetails() {
    this.loaderService.show.set(true);
    this.appService.getAllInquiryDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.inquiryDetails.set(data['data']);
          this.loaderService.show.set(false);
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  editInquiryDetails(member: any) {
    this.sharedService.savedInquiryDataResponse.set(member);
    this.router.navigate(['/newInquiry']);
  }
}
