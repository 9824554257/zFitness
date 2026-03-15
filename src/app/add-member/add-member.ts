import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app-service';
import { SharedService } from '../shared-service'

@Component({
  selector: 'app-add-member',
  imports: [FormsModule],
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

  constructor(private appService : AppService, public sharedService : SharedService) {}

  ngOnInit(): void {
    this.fetchPackageDetails()
  }

  printData() {
    console.log(this.memberDetails);
  }

  savememberDetails() {
    let request: any = {
      memberNo: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.memberNumber) ? this.memberDetails.memberNumber : '',
      fullName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.fullName) ? this.memberDetails.fullName : '',
      email: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.emailAddress) ? this.memberDetails.emailAddress : '',
      mobileNumber: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.mobileNumber) ? this.memberDetails.mobileNumber : '',
      dateOfBirth: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dateOfBirth) ? this.memberDetails.dateOfBirth : null,
      occupation: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.occupation) ? this.memberDetails.occupation : '',
      // package: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName) ? this.memberDetails.packageName : null,
      // packageName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.selectedPackageName) ? this.memberDetails.selectedPackageName : null,
      // packageActualFee: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageActualFee) ? this.memberDetails.packageActualFee : null,
      amount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.amount) ? this.memberDetails.amount : null,
      planStartDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.startDate) ? this.memberDetails.startDate : null,
      planEndDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.endDate) ? this.memberDetails.endDate : null,
      dueDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.dueDate) ? this.memberDetails.dueDate : null,
      remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.remarks) ? this.memberDetails.remarks : '',
      gender: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.gender) ? this.memberDetails.gender : '',
      joinDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinDate) ? this.memberDetails.joinDate : null,
      joinWeight: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinWeight) ? this.memberDetails.joinWeight : null,
      joinHeight: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.joinHeight) ? this.memberDetails.joinHeight : null,
      age: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.age) ? this.memberDetails.age : null,
      period: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.period) ? this.memberDetails.period : '',
      personalTrainer: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.personalTrainer) ? this.memberDetails.personalTrainer : '',
      ptAmount: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.ptAmount) ? this.memberDetails.ptAmount : null,
      maritalStatus: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.maritalStatus) ? this.memberDetails.maritalStatus : '',
      address: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.address) ? this.memberDetails.address : '',
      shiftType: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.shiftType) ? this.memberDetails.shiftType : '',
      time: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.time) ? this.memberDetails.time : '',
      paidDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.paidDate) ? this.memberDetails.paidDate : null,
      // createdUser should be set in backend or from logged-in user context
    };
    this.appService.saveMemberDetails(request).subscribe((data : any) => {
      if(!this.sharedService.checkIfValueIsEmpty(data)) {
        this.sharedService.savedMemberDataResponse.set(data['data'])
      }
    }, (err : any) => {

    })
    
  }

  fetchPackageDetails() {
    this.sharedService.masterPackageDetailsList.set([]);
    this.appService.getMasterPackageDetails().subscribe((data: any) => {
      if (!this.sharedService.checkIfValueIsEmpty(data)) {
        this.sharedService.masterPackageDetailsList.set(data['data']);
      }
    }, (error: any) => {

    })
  }

  updatePackageDetails() {
    if(!this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName)) {
      let selectedObjForPackage : any = this.sharedService.masterPackageDetailsList().filter((singleObj : any) => singleObj['_id'] === this.memberDetails.packageName);
      if(selectedObjForPackage.length > 0) {
        this.memberDetails.period= selectedObjForPackage[0]['duration'];
        this.memberDetails.amount= selectedObjForPackage[0]['fee'];
        this.memberDetails.selectedPackageName = selectedObjForPackage[0]['packageName']
        this.memberDetails.packageActualFee = selectedObjForPackage[0]['fee'];
      }
    }

  }

  addPackage() {
    if(!this.sharedService.checkIfValueIsEmpty(this.sharedService.savedMemberDataResponse())) {
      let request : any = {
        memberNo: this.sharedService.savedMemberDataResponse().memberNo,
        memberID: this.sharedService.savedMemberDataResponse()._id,
        masterPackageId: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageName) ? this.memberDetails.packageName : null,
        packageName: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.selectedPackageName) ? this.memberDetails.selectedPackageName : null,
        fee: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.packageActualFee) ? this.memberDetails.packageActualFee : null,
        startDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.startDate) ? this.memberDetails.startDate : null,
        endDate: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.endDate) ? this.memberDetails.endDate : null,
        remarks: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.remarks) ? this.memberDetails.remarks : null,
        discountedPrice: !this.sharedService.checkIfValueIsEmpty(this.memberDetails.amount) ? this.memberDetails.amount : null,
      }
      this.appService.saveMasterPackageDetails(request).subscribe((data : any) => {

      }, (error : any) => {

      })
    }
  }
}
