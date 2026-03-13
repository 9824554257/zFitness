import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  memberDetails : any = [];
  
  constructor() {

  }
  checkIfValueIsEmpty = (value : any) => (value === '' || value === null || value === undefined);


  
}
