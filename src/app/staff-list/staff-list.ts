import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import { LoaderService } from '../loader-service';

@Component({
  selector: 'app-staff-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.css',
  standalone: true,
})
export class StaffList {
  staffList: any[] = [];

  constructor(
    private appService: AppService,
    public sharedService: SharedService,
    public loaderService: LoaderService,
    private router: Router,
  ) {
    this.loadStaff();
  }

  loadStaff() {
    this.loaderService.show.set(true);
    this.appService.getStaffDetails('').subscribe(
      (data: any) => {
        this.loaderService.show.set(false);
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.staffList = data['data'] || [];
        }
      },
      (err) => {
        this.loaderService.show.set(false);
      }
    );
  }

  editStaff(staff: any) {
    this.sharedService.savedStaffDataResponse.set(staff);
    this.router.navigate(['/addStaff']);
  }

  deleteStaff(staff: any) {
    if (!confirm('Delete this staff member?')) return;
    this.loaderService.show.set(true);
    this.appService.deleteStaffDetail(staff._id).subscribe(
      (res: any) => {
        this.loaderService.show.set(false);
        this.staffList = this.staffList.filter((s) => s._id !== staff._id);
        this.sharedService.snackBar.open('Staff deleted', 'Close', { duration: 2000 });
      },
      (err) => {
        this.loaderService.show.set(false);
        this.sharedService.snackBar.open('Failed to delete staff', 'Close', { duration: 3000 });
      }
    );
  }
}
