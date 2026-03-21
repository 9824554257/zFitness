import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  baseUrl: any = 'https://gym-five-blush.vercel.app';
  // baseUrl : any = 'http://localhost:3000';

  constructor(
    public http: HttpClient,
    public router: Router,
  ) {}

  getHeaders = () => {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });
  };

  getAllMemberDetails = () =>
    this.http.get(`${this.baseUrl}/members/getMemberDetails`, { headers: this.getHeaders() });

  saveMemberDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/members/saveMemberDetails`, request, {
      headers: this.getHeaders(),
    });

  getMasterPackageDetails = () =>
    this.http.get(`${this.baseUrl}/package/getPackageDetails`, { headers: this.getHeaders() });

  saveMasterPackageDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/package/savePackageDetails`, request, {
      headers: this.getHeaders(),
    });

  savePackageMasterDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/package/savePackageDetails`, request, {
      headers: this.getHeaders(),
    });

  //Misc master API Starts
  saveMiscData = (request: any) =>
    this.http.post(`${this.baseUrl}/miscMaster/saveMiscMaster`, request, {
      headers: this.getHeaders(),
    });

  getMiscMasterDataFromType = (request: any) =>
    this.http.post(`${this.baseUrl}/miscMaster/getMiscMaster`, request, {
      headers: this.getHeaders(),
    });

  updateMemberDetailsByUniqueId = (request: any) =>
    this.http.put(`${this.baseUrl}/members/updateMemberByUniqueId`, request, {
      headers: this.getHeaders(),
    });

  saveMemberPackageDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/memberDetailsPackage/saveMemberPackageDetails`, request, {
      headers: this.getHeaders(),
    });

  deleteMemberPackage = (packageId: any) =>
    this.http.delete(`${this.baseUrl}/memberDetailsPackage/deleteMemberPackageDetail?packageId=${packageId}`, {
      headers: this.getHeaders(),
    });

  deleteMemberDetails = (memberId: any) =>
    this.http.delete(`${this.baseUrl}/members/deleteMemberDetail?memberId=${memberId}`, {
      headers: this.getHeaders(),
    });

  // deleteMiscData = (request: any) =>
  //   this.http.delete(`${this.baseUrl}/miscMaster/getMiscMaster`, request, {
  //     headers: this.getHeaders(),
  //   });
  //Misc master API Ends
}
