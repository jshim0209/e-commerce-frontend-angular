import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn!: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      this.loggedIn = true;
    }
  }

  ngDoCheck() {
    if (localStorage.getItem("jwt")) {
      this.loggedIn = true;
    }
  }

  logout(): void {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    this.loggedIn = false;
    this.router.navigate(['/home']);
  }

}
