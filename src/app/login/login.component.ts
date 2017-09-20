import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormControl, Validators } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  logged: boolean;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  @Output()
    change: EventEmitter<boolean> = new EventEmitter<boolean>();

  login() {
    console.log(this.model);
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          this.logged = true;
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          console.log("ERROR: " + error );
        });
    this.logged = true;
    this.change.emit(this.logged);
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

}
