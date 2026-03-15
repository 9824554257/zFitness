import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';

@Component({
  selector: 'app-package-master',
  imports: [CommonModule, FormsModule],
  templateUrl: './package-master.html',
  styleUrl: './package-master.css',
})
export class PackageMaster implements OnInit {
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

  packageDetail: any = {
    packageName: '',
    fee: '',
    duration: '',
    remarks: '',
  };

  constructor(
    public appService: AppService,
    public sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    //this.getPackageList();
  }

  featureObject(data: any) {
    return data.split(',');
  }

  savePackageDetails() {
    this.appService.savePackageMasterDetails(this.packageDetail).subscribe(
      (data) => {
        console.log('Package Saved Succesfully.');
      },
      (error) => {
        console.log('Error in Package Save.');
      },
    );
    console.log(this.packageDetail);
  }

  getPackageList() {
    this.appService.getMasterPackageDetails().subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.masterPackageDetailsList.set(data['data']);
        }
      },
      (error: any) => {},
    );
  }
}
