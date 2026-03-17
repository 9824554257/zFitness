import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
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
      alert('Invalid Type. Please select another Type and try again.');
    }
  }
}
