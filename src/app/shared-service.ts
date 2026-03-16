import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  masterPackageDetailsList = signal<any[]>([]);
  memberDetails = signal<any[]>([]);
  savedMemberDataResponse = signal<any>({});

  constructor() {}
  checkIfValueIsEmpty = (value: any) => value === '' || value === null || value === undefined;
  isLogInPage = () => {
    return window.location.pathname === '/' || window.location.pathname === '/login'; //window.location.href.includes('login');
  }; //return false; //window.location.href.includes('login');
}
