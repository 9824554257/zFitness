import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}
  show = signal<any>(false);
  //public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // show(value: boolean) {
  //   this.showhideLoader.set();
  // }
}
