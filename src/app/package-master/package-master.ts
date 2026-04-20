import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { LoaderService } from '../loader-service';
import { OnlyNumbers } from '../only-numbers';

@Component({
  selector: 'app-package-master',
  imports: [CommonModule, FormsModule, OnlyNumbers],
  templateUrl: './package-master.html',
  styleUrl: './package-master.css',
})
export class PackageMaster implements OnInit {
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  packageDetails: any = {
    data: [
      {
        _id: '69b648788d0bc428ca488f2a',
        packageName: 'Test Package',
        fee: 8000,
        isActive: true,
        remarks: 'Cardio,Heave Exercise,Zumba,Aerobics,Yoga,Personal Trainer',
        createdUser: '69908bf41b9210605f28d199',
        discount: 0,
        duration: '6 Months',
        createdDate: '2026-03-15T05:49:44.547Z',
        __v: 0,
      },
      {
        _id: '69b6931d51c60cb4ea9c27d6',
        packageName: 'Test Package 3',
        fee: 20000,
        isActive: true,
        remarks: 'Cardio,Heave Exercise,Zumba,Aerobics,Yoga,No Trainer',
        createdUser: '69908bf41b9210605f28d199',
        discount: 0,
        duration: '12 Months',
        createdDate: '2026-03-15T11:08:13.804Z',
        __v: 0,
      },
      {
        _id: '69b6931d51c60cb4ea9c27d6',
        packageName: 'Test Package 3',
        fee: 20000,
        isActive: true,
        remarks: 'Cardio,Heave Exercise,Zumba,Aerobics,Yoga,No Trainer',
        createdUser: '69908bf41b9210605f28d199',
        discount: 0,
        duration: '12 Months',
        createdDate: '2026-03-15T11:08:13.804Z',
        __v: 0,
      },
      {
        _id: '69b6931d51c60cb4ea9c27d6',
        packageName: 'Test Package 3',
        fee: 20000,
        isActive: true,
        remarks: 'Cardio,Heave Exercise,Zumba,Aerobics,Yoga,No Trainer',
        createdUser: '69908bf41b9210605f28d199',
        discount: 0,
        duration: '12 Months',
        createdDate: '2026-03-15T11:08:13.804Z',
        __v: 0,
      },
      {
        _id: '69b6931d51c60cb4ea9c27d6',
        packageName: 'Test Package 3',
        fee: 20000,
        isActive: true,
        remarks: 'Cardio,Heave Exercise,Zumba,Aerobics,Yoga,No Trainer',
        createdUser: '69908bf41b9210605f28d199',
        discount: 0,
        duration: '12 Months',
        createdDate: '2026-03-15T11:08:13.804Z',
        __v: 0,
      },
      {
        _id: '69b6931d51c60cb4ea9c27d6',
        packageName: 'Test Package 3',
        fee: 20000,
        isActive: true,
        remarks: 'Cardio,Heave Exercise,Zumba,Aerobics,Yoga,No Trainer',
        createdUser: '69908bf41b9210605f28d199',
        discount: 0,
        duration: '12 Months',
        createdDate: '2026-03-15T11:08:13.804Z',
        __v: 0,
      },
    ],
  };

  @ViewChild('deletePackageModal') deletePackageModal!: ElementRef<HTMLDialogElement>;
  selectedPackageToDelete: any = null;

  packageDetail: any = {
    packageName: '',
    fee: '',
    duration: '',
    remarks: '',
  };

  constructor(
    public appService: AppService,
    public sharedService: SharedService,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.getPackageList();
  }

  featureObject(data: any) {
    return data.split(',');
  }

  savePackageDetails() {
    let isValid = true;
    if (this.sharedService.checkIfValueIsEmpty(this.packageDetail.packageName)) {
      isValid = false;
      document.getElementById('packageName')?.focus();
      this._snackBar.open('Please enter Package Name.', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['blue-snackbar'],
      });
    } else if (this.sharedService.checkIfValueIsEmpty(this.packageDetail.duration)) {
      isValid = false;
      document.getElementById('duration')?.focus();
      this._snackBar.open('Please enter Package Duration.', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['blue-snackbar'],
      });
    } else if (this.sharedService.checkIfValueIsEmpty(this.packageDetail.fee)) {
      isValid = false;
      document.getElementById('fees')?.focus();
      this._snackBar.open('Please enter Fees.', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['blue-snackbar'],
      });
    }
    // else if(this.packageDetail.){
    //isValid=false;
    //document.getElementById('')?.focus();
    //   this._snackBar.open('Please enter Offer Price.', '', {
    //       horizontalPosition: this.horizontalPosition,
    //       verticalPosition: this.verticalPosition,
    //       duration: 3000,
    //       panelClass: ['blue-snackbar'],
    //     });
    // }
    // else if(this.packageDetail.){
    //isValid=false;
    //document.getElementById('')?.focus();
    //   this._snackBar.open('Please enter Offer Name.', '', {
    //       horizontalPosition: this.horizontalPosition,
    //       verticalPosition: this.verticalPosition,
    //       duration: 3000,
    //       panelClass: ['blue-snackbar'],
    //     });
    // }
    else if (this.sharedService.checkIfValueIsEmpty(this.packageDetail.remarks)) {
      isValid = false;
      document.getElementById('remarks')?.focus();
      this._snackBar.open('Please enter Remarks.', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['blue-snackbar'],
      });
    }
    if (isValid) {
      this.loaderService.show.set(true);
      this.appService.savePackageMasterDetails(this.packageDetail).subscribe(
        (data) => {
          (this, this.getPackageList());
          this.packageDetail = {
            packageName: '',
            fee: '',
            duration: '',
            remarks: '',
          };
          this._snackBar.open('Package Saved Succesfully.', '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
            panelClass: ['blue-snackbar'],
          });
          //console.log('Package Saved Succesfully.');
        },
        (error) => {
          this._snackBar.open('Error in Package Save.Please try again.', '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
            panelClass: ['blue-snackbar'],
          });
          //console.log('Error in Package Save.');
        },
      );
      console.log(this.packageDetail);
    }
  }

  getPackageList() {
    this.loaderService.show.set(true);
    this.appService.getMasterPackageDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.masterPackageDetailsList.set(data['data']);
          this.loaderService.show.set(false);
          //this.packageDetails = data['data'];
        }
      },
      (error: any) => {
        this.loaderService.show.set(false);
        this._snackBar.open('Error in Package fetch.Please try again.', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
          panelClass: ['blue-snackbar'],
        });
      },
    );
  }

  deletePackage(singlePackage: any) {
    this.selectedPackageToDelete = singlePackage;
    this.deletePackageModal.nativeElement.showModal();
  }

  closeDeleteModal() {
    this.deletePackageModal.nativeElement.close();
  }

  confirmDeletePackage() {
    this.closeDeleteModal();
    if (!this.selectedPackageToDelete) {
      return;
    }

    this.loaderService.show.set(true);
    this.appService.deletePackageMasterDetails(this.selectedPackageToDelete._id).subscribe(
      () => {
        this.getPackageList();
        this.selectedPackageToDelete = null;
        this.loaderService.show.set(false);
        this._snackBar.open('Package deleted successfully.', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
          panelClass: ['blue-snackbar'],
        });
      },
      (error: any) => {
        this.loaderService.show.set(false);
        this._snackBar.open('Error deleting package. Please try again.', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
          panelClass: ['blue-snackbar'],
        });
      },
    );
  }
}
