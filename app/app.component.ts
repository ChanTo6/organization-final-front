import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRoleService } from './service/UserRoleService';
//import { Router } from '@angular/router'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  role: string | null = '';

  constructor(private userRoleService: UserRoleService) {}

  ngOnInit(): void {
    // Set initial role from localStorage
    this.role = localStorage.getItem('userRole');

    // Subscribe to role changes from service
    this.userRoleService.role$.subscribe(role => {
      this.role = role;
      if (role) {
        localStorage.setItem('userRole', role); // Update localStorage when role changes
      } else {
        localStorage.removeItem('userRole');
      }
    });
  }
  }


