import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  baseUrl: any = 'https://gym-five-blush.vercel.app';
  //baseUrl : any = 'http://localhost:3000';

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

  savePackageMasterDetails = (request: any) =>
    this.http.post(`${this.baseUrl}/package/savePackageDetails`, request, {
      headers: this.getHeaders(),
    });
}
