import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto } from 'src/app/models/LoginDto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm!: UntypedFormGroup;
  loginDto!: LoginDto;
  isUsername: boolean = false;
  isPassword: boolean = false;
  invalidCredentials: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {

    this.isLoggedIn();

    this.loginForm = this.fb.group({
      email: new
    })
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService
      .login(email, password)
      .subscribe({
        next: (v) => {
          localStorage.setItem('jwt', v.body.jwt);
          localStorage.setItem('userId', v.body.userId);
        },
      });
    form.reset();
  }

  isLoggedIn(){
    if (localStorage.getItem('jwt') != null) {
      return true;
    } else {
      return false;
    }
  }

}
