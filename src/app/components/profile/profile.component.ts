import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId = localStorage.getItem("userId");
  jwt = localStorage.getItem("jwt");
  user!: User;
  userRole!: String;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUserById().subscribe({
      next: (data) => {
        this.user = data;
        this.userRole = this.formatRole(this.user.userRole.role);
      },
      error: (e: any) => {
        console.log("Did not get user from backend" + e);
      }
    })
  }

  formatRole(role: string) {
    if (role === "ROLE_BUYER") {
      return "Buyer";
    }
    else if (role === "ROLE_SELLER") {
      return "Seller";
    }
    else if (role === "ROLE_ADMIN") {
      return "Admin";
    } else {
      return "Invalid";
    }
  }

}
