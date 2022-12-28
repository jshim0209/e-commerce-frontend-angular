import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategory } from 'src/app/models/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn!: boolean;

  productCategories: ProductCategory[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {

    this.listProductCategories();

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

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
