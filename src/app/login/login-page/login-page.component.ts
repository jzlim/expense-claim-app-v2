import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [LoginService]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  
  public form: FormGroup;
  public hasError: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: FormBuilder, private loginService: LoginService, private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  validate() {
    this.hasError = this.email.invalid || this.password.invalid;
  }

  submit() {
    this.validate();
    if (!this.hasError) {
      const obj = { email: this.email.value, password: this.password.value }
      const obs = this.loginService.login({ user: obj });
      obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (resp: any) => {
          if (resp?.accessToken) {
            this.authService.setSession(resp);
            this.router.navigate(['./home']);
          } else {
            this.hasError = true;
          }
        }
      )
    }
  }

  ngOnDestroy(): void {
    if (this.ngUnsubscribe) {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  }

  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }
}
