import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
import { ServiceService } from '../../../service/service.service';
import { UserData } from '../../../Models/UserData';
import { LoginRequest } from '../../../Models/LoginRequest';
import { UserRoleService } from '../../../service/UserRoleService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  showLoginForm: boolean = true;
  constructor(private fb: FormBuilder, private service: ServiceService, private userRoleService: UserRoleService) { }

  registrationForm!: FormGroup;

  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    console.log("routing is finished");
    localStorage.clear();
    this.registrationForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      employeeName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      organizationName: ['', Validators.required],
      organizationAddress: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: [''],
      personId: [0, Validators.required],
      role: ['admin'],
    });

  }
  username: string = '';
  password: string = '';
  onSubmit(): void {
    const request: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
  
    this.service.login(request).subscribe((response: any) => {
      if (response.token) {
        // Store token and role in localStorage
        localStorage.setItem('token', response.token);
      // localStorage.setItem('userRole', response.role);
        this.userRoleService.setRole(response.role);

      } else {
        // Handle login failure
        alert('Login failed');
      }
    });
  }
  
    RegisteronSubmit() {
    if (this.registrationForm.valid) {
      this.service.register(this.registrationForm.value).subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.registrationForm.reset();
        },
        (error: any) => {
          console.error('Registration failed', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }


  navigateToRegistration() {
    this.showLoginForm = false;  // Show registration form
  }

  navigateToAuthorization() {
    this.showLoginForm = true;   // Show login form
  }

}
