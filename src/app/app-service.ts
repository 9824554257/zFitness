import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppService {

  baseUrl : any = 'https://gym-five-blush.vercel.app';

  constructor(
    public http: HttpClient,
    public router: Router,
  ) {}

  getHeaders = () => {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  } 

  getAllMemberDetails = () => this.http.get(`${this.baseUrl}/members/getMemberDetails`, {headers: this.getHeaders()});
  
}
