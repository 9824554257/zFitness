import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('delModal') modal!: ElementRef<HTMLDialogElement>;
  selectedInquiryToDelete: any = null;

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


  deleteInquiry(member : any) {
    this.selectedInquiryToDelete = member;
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
  }

  confirmDelete() {
    this.closeModal();
    if (this.selectedInquiryToDelete) {
      this.loaderService.show.set(true);
      this.appService.deleteInquiryDetails(this.selectedInquiryToDelete._id).subscribe(
        (data: any) => {
          this.loaderService.show.set(false);
          this.fetchAllInquiryDetails(); // Refresh the list
          this.selectedInquiryToDelete = null;
          // Close the modal
          const modal = document.getElementById('delRow');
          if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
          }
        },
        (error: any) => {
          this.loaderService.show.set(false);
        },
      );
    }
  }

  convertToMember(member: any) {
    // Map inquiry data to member data
    const memberData = {
      fullName: member.fullName,
      email: member.email,
      mobileNumber: member.mobileNumber,
      gender: member.gender,
      dateOfBirth: member.dateOfBirth,
      inquiryDate: member.inquiryDate,
      occupation: member.occupation,
      packageName: member.packageType,
      remarks: member.remarks,
    };
    this.sharedService.savedMemberDataResponse.set(memberData);
    this.router.navigate(['/newMember']);
  }
}
