import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import { LoaderService } from '../loader-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-staff',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-staff.html',
  styleUrl: './add-staff.css',
})
export class AddStaff implements OnInit, OnDestroy {
  selectedPhotoFile: File | null = null;
  currentImageUrl: string | null = null;
  isEditMode: boolean = false;

  staffDetails: any = {
    staffName: '',
    email: '',
    phoneNumber: '',
    expertise: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  };

  constructor(
    private appService: AppService,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.populateStaffDetailsFromResponse();
  }

  ngOnDestroy(): void {
    this.resetStaffDetails();
    this.sharedService.savedStaffDataResponse.set({});
  }

  populateStaffDetailsFromResponse() {
    const savedStaff = this.sharedService.savedStaffDataResponse();
    if (!this.sharedService.checkIfValueIsEmpty(savedStaff)) {
      this.isEditMode = true;
      this.staffDetails.staffName = savedStaff.staffName || '';
      this.staffDetails.email = savedStaff.email || '';
      this.staffDetails.phoneNumber = savedStaff.phoneNumber || '';
      this.staffDetails.expertise = savedStaff.expertise || '';
      this.staffDetails.emergencyContactName = savedStaff.emergencyContactName || '';
      this.staffDetails.emergencyContactNumber = savedStaff.emergencyContactNumber || '';
      this.currentImageUrl = savedStaff.userImageUrl || null;
    }
  }

  resetStaffDetails() {
    this.staffDetails = {
      staffName: '',
      email: '',
      phoneNumber: '',
      expertise: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
    };
    this.selectedPhotoFile = null;
    this.currentImageUrl = null;
    this.isEditMode = false;
  }

  cancel() {
    this.resetStaffDetails();
    this.router.navigate(['/staffList']);
  }

  onPhotoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        this.sharedService.snackBar.open('File size must be less than 1MB', 'Close', { duration: 3000 });
        return;
      }
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentImageUrl = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  deleteCurrentImage() {
    this.selectedPhotoFile = null;
    this.currentImageUrl = null;
    // If editing existing staff and image exists, call API to delete
    const savedStaff = this.sharedService.savedStaffDataResponse();
    if (this.isEditMode && savedStaff && savedStaff.userImageUrl) {
      if (confirm('Are you sure you want to delete the current photo?')) {
        this.loaderService.show.set(true);
        this.appService.deleteStaffImage(savedStaff._id).subscribe(
          () => {
            this.loaderService.show.set(false);
            const updated = { ...savedStaff, userImageUrl: null, userImageId: null };
            this.sharedService.savedStaffDataResponse.set(updated);
            this.sharedService.snackBar.open('Photo deleted successfully!', 'Close', { duration: 3000 });
          },
          (error) => {
            this.loaderService.show.set(false);
            this.sharedService.snackBar.open('Failed to delete photo', 'Close', { duration: 3000 });
          }
        );
      }
    }
  }

  triggerStaffFileClick() {
    const el = document.getElementById('staffPhotoFile') as HTMLInputElement | null;
    if (el) el.click();
  }

  saveStaff(redirect: boolean) {
    // Basic validation
    if (!this.staffDetails.staffName || !this.staffDetails.email || !this.staffDetails.phoneNumber) {
      this.sharedService.snackBar.open('Name, email and phone are mandatory');
      return;
    }

    this.loaderService.show.set(true);
    const request: any = {
      staffName: this.staffDetails.staffName,
      email: this.staffDetails.email,
      phoneNumber: this.staffDetails.phoneNumber,
      expertise: this.staffDetails.expertise || '',
      emergencyContactName: this.staffDetails.emergencyContactName || '',
      emergencyContactNumber: this.staffDetails.emergencyContactNumber || '',
    };

    const savedStaff = this.sharedService.savedStaffDataResponse();
    const apiCall = !this.sharedService.checkIfValueIsEmpty(savedStaff)
      ? (() => {
          request['uniqueId'] = savedStaff._id;
          return this.appService.updateStaffByUniqueId(request);
        })()
      : this.appService.saveStaffDetails(request);

    apiCall.subscribe(
      (res: any) => {
        this.loaderService.show.set(false);
        const successMsg = this.isEditMode ? 'Staff updated successfully' : 'Staff saved successfully';
        this.sharedService.snackBar.open(successMsg);

        // Determine staff ID for image upload
        let staffId: string = '';
        if (this.isEditMode && savedStaff._id) {
          staffId = savedStaff._id;
        } else if (res?.data?._id) {
          staffId = res.data._id;
        }

        // Upload image if selected
        if (this.selectedPhotoFile && staffId) {
          this.appService.uploadStaffImage(this.selectedPhotoFile as File, staffId).subscribe(
            (resp: any) => {
              this.sharedService.snackBar.open('Photo uploaded successfully', 'Close', { duration: 3000 });
              if (redirect) {
                this.resetStaffDetails();
                this.router.navigate(['/staffList']);
              }
            },
            (err) => {
              this.sharedService.snackBar.open('Failed to upload photo', 'Close', { duration: 3000 });
              if (redirect) {
                this.resetStaffDetails();
                this.router.navigate(['/staffList']);
              }
            }
          );
        } else if (redirect) {
          this.resetStaffDetails();
          this.router.navigate(['/staffList']);
        }
      },
      (err) => {
        this.loaderService.show.set(false);
        const errorMsg = this.isEditMode ? 'Failed to update staff' : 'Failed to save staff';
        this.sharedService.snackBar.open(errorMsg, 'Close', { duration: 3000 });
      }
    );
  }
}
