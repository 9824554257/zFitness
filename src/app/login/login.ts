import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  ) {}
  emailID: any = 'a@a.com';
  password: any = '123456';
  ngOnInit(): void {
    this.login();
  }

  login() {
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
    let reqLogin = { email: 'admin@g.com', password: '123456' };
    this.http
      .post('https://gym-five-blush.vercel.app/users/login', reqLogin, httpOptions)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        },
      );
  }

  loginButtonClick() {
    console.log({ email: this.emailID, password: this.password });
    this.router.navigate(['/newMemberList']);
  }
}
