import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../loader-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-member',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-member.html',
  styleUrl: './add-member.css',
})
export class AddMember implements OnInit {
  memberDetails: any = {
    memberNumber: '',
    fullName: '',
    emailAddress: '',
    mobileNumber: '',
    dateOfBirth: '',
    inquiryDate: '',
    occupation: '',
    packageType: '',
    joinDate: '',
    dueDate: '',
    remarks: '',
    gender: '',
    period: '',
    personalTrainer: '',
    ptAmount: '',
    age: '',
    maritalStatus: '',
    address: '',
    shiftType: '',
    time: '',
    joinWeight: '',
    paidDate: '',
    packageDetails: {
      packageName: '',
      period: '',
      startDate: '',
      endDate: '',
      amount: '',
    },
    ptDetails: {
      ptName: '',
      ptPeriod: '',
      amount: '',
    },
  };

  constructor(
    private appService: AppService,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
    public router: Router,
  ) {}

  populateMemberDetailsFromResponse() {
    if (!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      this.memberDetails.memberNumber = this.sharedService.savedMemberDataResponse().memberNo || '';
      this.memberDetails.fullName = this.sharedService.savedMemberDataResponse().fullName || '';
      this.memberDetails.emailAddress = this.sharedService.savedMemberDataResponse().email || '';
      this.memberDetails.mobileNumber =
        this.sharedService.savedMemberDataResponse().mobileNumber || '';
      this.memberDetails.dateOfBirth =
        this.sharedService.savedMemberDataResponse().dateOfBirth || '';
      this.memberDetails.occupation = this.sharedService.savedMemberDataResponse().occupation || '';
      this.memberDetails.amount = this.sharedService.savedMemberDataResponse().amount || '';
      this.memberDetails.startDate =
        this.sharedService.savedMemberDataResponse().planStartDate || '';
      this.memberDetails.endDate = this.sharedService.savedMemberDataResponse().planEndDate || '';
      this.memberDetails.dueDate = this.sharedService.savedMemberDataResponse().dueDate || '';
      this.memberDetails.remarks = this.sharedService.savedMemberDataResponse().remarks || '';
      this.memberDetails.gender = this.sharedService.savedMemberDataResponse().gender || '';
      this.memberDetails.joinDate = this.sharedService.savedMemberDataResponse().joinDate || '';
      this.memberDetails.joinWeight = this.sharedService.savedMemberDataResponse().joinWeight || '';
      this.memberDetails.joinHeight = this.sharedService.savedMemberDataResponse().joinHeight || '';
      this.memberDetails.age = this.sharedService.savedMemberDataResponse().age || '';
      this.memberDetails.period = this.sharedService.savedMemberDataResponse().period || '';
      this.memberDetails.personalTrainer =
        this.sharedService.savedMemberDataResponse().personalTrainer || '';
      this.memberDetails.ptAmount = this.sharedService.savedMemberDataResponse().ptAmount || '';
      this.memberDetails.maritalStatus =
        this.sharedService.savedMemberDataResponse().maritalStatus || '';
      this.memberDetails.address = this.sharedService.savedMemberDataResponse().address || '';
      this.memberDetails.shiftType = this.sharedService.savedMemberDataResponse().shiftType || '';
      this.memberDetails.time = this.sharedService.savedMemberDataResponse().time || '';
      this.memberDetails.paidDate = this.sharedService.savedMemberDataResponse().paidDate || '';
      this.memberDetails.memberPackageDetails =
        this.sharedService.savedMemberDataResponse().memberPackageDetails;
    }

    // Add more assignments as needed for other fields
  }

  ngOnInit(): void {
    this.loaderService.show.set(true);
    this.populateMemberDetailsFromResponse();
    this.fetchPackageDetails();
    this.getMiscDataFromType();
  }

  printData() {
    console.log(this.memberDetails);
  }

  savememberDetails(redirect: boolean) {
    this.loaderService.show.set(true);
    let request: any = {
      memberNo: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.memberNumber)
        ? this.memberDetails.memberNumber
        : '',
      fullName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.fullName)
        ? this.memberDetails.fullName
        : '',
      email: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.emailAddress)
        ? this.memberDetails.emailAddress
        : '',
      mobileNumber: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.mobileNumber)
        ? this.memberDetails.mobileNumber
        : '',
      dateOfBirth: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dateOfBirth)
        ? this.memberDetails.dateOfBirth
        : null,
      occupation: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.occupation)
        ? this.memberDetails.occupation
        : '',
      // package: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName) ? this.memberDetails.packageName : null,
      // packageName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.selectedPackageName) ? this.memberDetails.selectedPackageName : null,
      // packageActualFee: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageActualFee) ? this.memberDetails.packageActualFee : null,
      amount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.amount)
        ? this.memberDetails.amount
        : null,
      planStartDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.startDate)
        ? this.memberDetails.startDate
        : null,
      planEndDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.endDate)
        ? this.memberDetails.endDate
        : null,
      dueDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dueDate)
        ? this.memberDetails.dueDate
        : null,
      remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.remarks)
        ? this.memberDetails.remarks
        : '',
      gender: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.gender)
        ? this.memberDetails.gender
        : '',
      joinDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinDate)
        ? this.memberDetails.joinDate
        : null,
      joinWeight: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinWeight)
        ? this.memberDetails.joinWeight
        : null,
      joinHeight: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinHeight)
        ? this.memberDetails.joinHeight
        : null,
      age: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.age)
        ? this.memberDetails.age
        : null,
      period: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.period)
        ? this.memberDetails.period
        : '',
      personalTrainer: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.personalTrainer)
        ? this.memberDetails.personalTrainer
        : '',
      ptAmount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptAmount)
        ? this.memberDetails.ptAmount
        : null,
      maritalStatus: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.maritalStatus)
        ? this.memberDetails.maritalStatus
        : '',
      address: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.address)
        ? this.memberDetails.address
        : '',
      shiftType: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.shiftType)
        ? this.memberDetails.shiftType
        : '',
      time: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.time)
        ? this.memberDetails.time
        : '',
      paidDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.paidDate)
        ? this.memberDetails.paidDate
        : null,
      // createdUser should be set in backend or from logged-in user context
    };

    if (!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      request['uniqueId'] = this.sharedService.savedMemberDataResponse()._id;
    }
    this.appService[
      !this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())
        ? 'updateMemberDetailsByUniqueId'
        : 'saveMemberDetails'
    ](request).subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          this.sharedService.savedMemberDataResponse.set(data['data']);
          this.loaderService.show.set(false);
          if (redirect) {
            this.router.navigate(['/newMemberList']);
          }
        }
      },
      (err: any) => {
        this.loaderService.show.set(false);
      },
    );
  }

  fetchPackageDetails() {
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
  miscData: any;
  occupationList: any;
  maritalStatusList: any;
  shiftList: any;

  getMiscDataFromType() {
    let request = { headerTypes: ['Occupation', 'Marital Status', 'Shift type'] };
    this.appService.getMiscMasterDataFromType(request).subscribe(
      (data: any) => {
        if (!this.sharedService.checkIfValueIsEmpty(data)) {
          //Misc data to assign to different variables
          this.miscData = data['data'];
          this.occupationList = this.miscData.filter(
            (singleData: any) => singleData.headerType === 'Occupation',
          )[0].keyValuePairs;
          this.maritalStatusList = this.miscData.filter(
            (singleData: any) => singleData.headerType === 'Marital Status',
          )[0].keyValuePairs;
          this.shiftList = this.miscData.filter(
            (singleData: any) => singleData.headerType === 'Shift type',
          )[0].keyValuePairs;
          this.loaderService.show.set(false);
          this.cdr.detectChanges();
        }
      },
      (error) => {
        //this.loaderService.show.set(false);
        alert('Error in fetching data for selected Misc Type.');
      },
    );
  }

  updatePackageDetails() {
    if (!this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName)) {
      let selectedObjForPackage: any = this.sharedService
        .masterPackageDetailsList()
        .filter((singleObj: any) => singleObj['_id'] === this.memberDetails.packageName);
      if (selectedObjForPackage.length > 0) {
        this.memberDetails.period = selectedObjForPackage[0]['duration'];
        this.memberDetails.amount = selectedObjForPackage[0]['fee'];
        this.memberDetails.selectedPackageName = selectedObjForPackage[0]['packageName'];
        this.memberDetails.packageActualFee = selectedObjForPackage[0]['fee'];
      }
    }
  }

  addPackage(redirect: boolean) {
    if (!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      let request: any = {
        memberNo: this.sharedService.savedMemberDataResponse().memberNo,
        memberID: this.sharedService.savedMemberDataResponse()._id,
        masterPackageId: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName)
          ? this.memberDetails.packageName
          : null,
        packageName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.selectedPackageName)
          ? this.memberDetails.selectedPackageName
          : null,
        fee: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageActualFee)
          ? this.memberDetails.packageActualFee
          : null,
        startDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.startDate)
          ? this.memberDetails.startDate
          : null,
        endDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.endDate)
          ? this.memberDetails.endDate
          : null,
        remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.remarks)
          ? this.memberDetails.remarks
          : null,
        discountedPrice: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.amount)
          ? this.memberDetails.amount
          : null,
      };
      this.appService.saveMemberPackageDetails(request).subscribe(
        (data: any) => {
          if (this.sharedService.checkIfValueIsEmpty(this.memberDetails.memberPackageDetails)) {
            this.memberDetails.memberPackageDetails = [];
          }
          this.memberDetails.memberPackageDetails.push(data['data']);
          if (redirect) {
            this.router.navigate(['newMemberList']);
          }
        },
        (error: any) => {},
      );
    }
  }
}
