import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  masterPackageDetailsList = signal<any[]>([]);
  memberDetails = signal<any[]>([]);
  savedMemberDataResponse = signal<any>({});
  snackBar = inject(MatSnackBar);

  constructor() { }
  checkIfValueIsEmpty = (value: any) => value === '' || value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0);
  isLogInPage = () => {
    return window.location.pathname === '/' || window.location.pathname === '/login'; //window.location.href.includes('login');
  }; //return false; //window.location.href.includes('login');

  blockSpecialCharactersOnInput(event: InputEvent) {
    const pattern = /[a-zA-Z0-9 ]/;

    // event.data contains the character(s) being inserted
    if (event.data && !pattern.test(event.data)) {
      // This stops the character from being added to the input
      event.preventDefault();
    }


  }
}
