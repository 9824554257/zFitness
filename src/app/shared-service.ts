import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  masterPackageDetailsList = signal<any[]>([]);
  memberDetails = signal<any[]>([]);
  
  constructor() {

  }
  checkIfValueIsEmpty = (value : any) => (value === '' || value === null || value === undefined);


  
}
