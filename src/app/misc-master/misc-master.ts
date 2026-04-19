import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppService } from '../app-service';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared-service';
import { LoaderService } from '../loader-service';

@Component({
  selector: 'app-misc-master',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './misc-master.html',
  styleUrl: './misc-master.css',
  standalone: true,
})
export class MiscMaster {
  @ViewChild('delModal') modal!: ElementRef<HTMLDialogElement>;
  selectedMiscToDelete: any = null;

  type: any;
  textValue: any;
  miscData: any = [];
  constructor(
    public appService: AppService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
  ) {}

  getMiscDataFromType() {
    this.loaderService.show.set(true);
    this.miscData = [];
    let request = { headerTypes: [this.type] };
    this.appService.getMiscMasterDataFromType(request).subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.loaderService.show.set(false);
          this.miscData = data['data'][0].keyValuePairs;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        // this.loaderService.show(false);
        alert('Error in fetching data for selected Misc Type.');
      },
    );
  }

  saveMiscData() {
    if (
      !this.sharedService.checkIfValueIsEmpty(this.type) &&
      !this.sharedService.checkIfValueIsEmpty(this.textValue) &&
      this.type.toString().toUpperCase() !== 'SELECT'
    ) {
      this.loaderService.show.set(true);
      let request = {
        headerType: this.type,
        keyValuePairs: [
          {
            key: this.textValue,
            value: this.textValue,
          },
        ],
      };
      this.appService.saveMiscData(request).subscribe(
        (data) => {
          this.getMiscDataFromType();
          alert('Misc data saved succesfully.');
        },
        (error) => {
          //this.loaderService.show(false);
          alert('Error in Misc data save.');
        },
      );
    } else {
      this.sharedService.snackBar.open('Name and type are mandatory.');
    }
  }

  deleteMisc(misc: any) {
    this.selectedMiscToDelete = misc;
    this.modal.nativeElement.showModal();
  }

  closeModal() {
    this.modal.nativeElement.close();
  }

  confirmDelete() {
    this.closeModal();
    if (this.selectedMiscToDelete) {
      this.loaderService.show.set(true);
      this.appService.deleteMiscData(this.selectedMiscToDelete._id).subscribe(
        (data: any) => {
          this.loaderService.show.set(false);
          this.getMiscDataFromType(); // Refresh the list
          this.selectedMiscToDelete = null;
        },
        (error: any) => {
          this.loaderService.show.set(false);
        },
      );
    }
  }
}
