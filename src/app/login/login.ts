import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from '../loader-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(
    public http: HttpClient,
    public router: Router,
    public loaderService: LoaderService,
  ) {}
  emailID: any;
  password: any;
  ngOnInit(): void {
    // this.login();
  }

  login() {
    this.loaderService.show.set(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const httpOptions = {
      headers: headers,
    };
    let reqLogin = { email: this.emailID, password: this.password };
    this.http
      .post('https://gym-five-blush.vercel.app/users/login', reqLogin, httpOptions)
      .subscribe(
        (data: any) => {
          if (data.token) {
            sessionStorage.setItem('token', data.token);
          }
          if (data.refreshToken) {
            sessionStorage.setItem('refreshToken', data.refreshToken);
          }
          this.loaderService.show.set(false);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.loaderService.show.set(false);
          alert('Invalid Credentials!!');
        },
      );
  }

  loginButtonClick() {
    console.log({ email: this.emailID, password: this.password });
    this.router.navigate(['/home']);
  }
}
