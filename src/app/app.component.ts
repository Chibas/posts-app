import { Component, OnInit } from '@angular/core';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';

import { Post } from './_helpers/post';
import { User } from './_helpers/user';

import { LoadPostsService } from './services/load-posts.service';
import { AuthenticationService } from './services/authentication.service';
import { RouterModule, Routes, Router, } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  currentUser : User;
  logged: boolean;

  constructor(private router: Router, private auth: AuthenticationService ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.logged = auth.isAuthenticated;
    auth.authenticated.subscribe((value) => {
      this.logged = value;
      console.log(this.logged);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    this.logged = (JSON.parse(localStorage.getItem('currentUser')) === null) ? true : false;
    console.log(this.logged + "ss");
  }
}
