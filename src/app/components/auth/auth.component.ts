import { Component, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {

    this.isLoggedIn();

    this.loginForm = this.fb.group({
      email: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
      password: new UntypedFormControl('', [Validators.required, this.noWhitespaceValidator]),
    });
  }

  noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace' : true };
  }

  login() {
    this.isUsername = false;
    this.isPassword = false;
    this.invalidCredentials = false;

    if (this.loginForm.valid) {
      this.loginDto = {
        ...this.loginForm.value
      }
      this.authService
      .login(this.loginDto.email, this.loginDto.password)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt', response.body.jwt);
          localStorage.setItem('userId', response.body.userId);
        },
        error: (error: any) => {
          console.log(error);
          this.invalidCredentials = true;
          console.log(this.invalidCredentials);
        },
      });
    } else {

      if (!this.loginForm.value.email) {
          this.isUsername = true;
      }
      if (!this.loginForm.value.password) {
          this.isPassword = true;
      }
    }
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
