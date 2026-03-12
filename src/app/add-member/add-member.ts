import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  constructor(public http: HttpClient) {}

  ngOnInit(): void {}

  printData() {
    console.log(this.memberDetails);
  }

  savememberDetails() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'User-Agent': 'EchoapiRuntime/1.1.0',
    });

    const httpOptions = {
      headers: headers,
    };
    this.http
      .post('https://gym-five-blush.vercel.app/users/saveData', this.memberDetails, httpOptions)
      .subscribe(
        (data) => {
          console.log('Save data successfully');
        },
        (error) => {
          console.log(error);
        },
      );
  }
}
