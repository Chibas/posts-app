import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) { }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
        data => {
          console.log('REGISTRATION SUCCESSFUL');
          this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
              data => {
                this.router.navigate(['/posts']);
              });
        },
        error => {
          console.log("ERROR " + error);
        });
  }

  ngOnInit() {
  }

}
