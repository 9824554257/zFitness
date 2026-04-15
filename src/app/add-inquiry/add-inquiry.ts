import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoaderService } from '../loader-service';
import { SharedService } from '../shared-service';
import { AppService } from '../app-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-inquiry',
  imports: [RouterModule, FormsModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './add-inquiry.html',
  styleUrl: './add-inquiry.css',
  standalone: true,
})
export class AddInquiry implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  inquiryDetails: any = {
    fullName: '',
    mobileNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    inquiryDate: '',
    occupation: '',
    packageType: '',
    followUpDate: '',
    remarks: '',
  };

  constructor(
    public loaderService: LoaderService,
    public sharedService: SharedService,
    public appService: AppService,
    public router: Router,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.populateInquiryDetails();
    this.fetchPackageDetails();
  }

  fetchPackageDetails() {
    this.loaderService.show.set(true);
    this.sharedService.masterPackageDetailsList.set([]);
    this.appService.getMasterPackageDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.masterPackageDetailsList.set(data['data']);
          this.loaderService.show.set(false);
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  populateInquiryDetails() {
    if (!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedInquiryDataResponse())) {
      let inquiryData = this.sharedService.savedInquiryDataResponse();
      this.inquiryDetails['inquiryId'] = inquiryData._id;
      this.inquiryDetails.fullName = inquiryData.fullName;
      this.inquiryDetails.mobileNumber = inquiryData.mobileNumber;
      this.inquiryDetails.email = inquiryData.email;
      this.inquiryDetails.gender = inquiryData.gender;
      this.inquiryDetails.dateOfBirth = this.formatDateForNgModel(inquiryData.dateOfBirth);
      this.inquiryDetails.inquiryDate = this.formatDateForNgModel(inquiryData.inquiryDate);
      this.inquiryDetails.occupation = inquiryData.occupation;
      this.inquiryDetails.packageType = inquiryData.packageType;
      this.inquiryDetails.followUpDate = this.formatDateForNgModel(inquiryData.followUpDate);
      this.inquiryDetails.remarks = inquiryData.remarks;
    }
  }

  saveInquiryDetails() {
    let isValid: any = true;
    let validationArray: any = [
      {
        ngModelValue: 'fullName',
        requiredMessage: 'Full name is mandatory',
      },
      {
        ngModelValue: 'email',
        requiredMessage: 'Email is mandatory',
      },
      {
        ngModelValue: 'mobileNumber',
        requiredMessage: 'Mobile Number is mandatory',
      },
      {
        ngModelValue: 'gender',
        requiredMessage: 'Gender is mandatory',
      },
      // {
      //   ngModelValue: 'dateOfBirth',
      //   requiredMessage: 'Date of birth is mandatory',
      // },
    ];

    validationArray.forEach((singleObj: any) => {
      if (
        this.sharedService.checkIfValueIsEmpty(this.inquiryDetails[singleObj['ngModelValue']]) &&
        isValid
      ) {
        this.sharedService.snackBar.open(singleObj['requiredMessage'], '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
          panelClass: ['blue-snackbar'],
        });
        isValid = false;
      }
    });

    if (isValid) {
      this.loaderService.show.set(true);
      this.inquiryDetails.dateOfBirth = !this.sharedService.checkIfValueIsEmpty(
        this.inquiryDetails.dateOfBirth,
      )
        ? this.datePipe.transform(new Date(this.inquiryDetails.dateOfBirth), 'yyyy-MM-dd')
        : null;
      this.inquiryDetails.inquiryDate = !this.sharedService.checkIfValueIsEmpty(
        this.inquiryDetails.inquiryDate,
      )
        ? this.datePipe.transform(new Date(this.inquiryDetails.inquiryDate), 'yyyy-MM-dd')
        : null;
      this.inquiryDetails.followUpDate = !this.sharedService.checkIfValueIsEmpty(
        this.inquiryDetails.followUpDate,
      )
        ? this.datePipe.transform(new Date(this.inquiryDetails.followUpDate), 'yyyy-MM-dd')
        : null;
      if (!this.sharedService.checkIfValueIsEmpty(this.inquiryDetails.inquiryId)) {
        this.appService.updateInquiryDetails(this.inquiryDetails).subscribe(
          (data) => {
            this.loaderService.show.set(false);
            this.sharedService.savedInquiryDataResponse.set([]);
            if (!this.sharedService.checkIfValueIsEmpty(data)) {
              this.sharedService.snackBar.open('Inquiry details updated successfully.', '', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['blue-snackbar'],
              });
              this.router.navigate(['inquiryList']);
            } else {
              this.sharedService.snackBar.open('Update Inquiry details returned null.', '', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['blue-snackbar'],
              });
            }
          },
          (error) => {
            this.loaderService.show.set(false);
            this.sharedService.snackBar.open(
              'Update Inquiry details failed.Please try again after sometime.',
              '',
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['blue-snackbar'],
              },
            );
          },
        );
      } else {
        this.appService.saveInquiryDetails(this.inquiryDetails).subscribe(
          (data) => {
            this.loaderService.show.set(false);
            if (!this.sharedService.checkIfValueIsEmpty(data)) {
              this.sharedService.snackBar.open('Inquiry details saved successfully.', '', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['blue-snackbar'],
              });
              this.router.navigate(['inquiryList']);
            } else {
              this.sharedService.snackBar.open('Save Inquiry details returned null.', '', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['blue-snackbar'],
              });
            }
          },
          (error) => {
            this.loaderService.show.set(false);
            this.sharedService.snackBar.open(
              'Save Inquiry details failed.Please try again after sometime.',
              '',
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['blue-snackbar'],
              },
            );
          },
        );
      }
    }
  }

  private formatDateForNgModel(dateValue: any): string {
    if (this.sharedService.checkIfValueIsEmpty(dateValue)) return '';
    const date = new Date(dateValue);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
