import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = "";

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })

  }

  pagination() {
    const previousBtn = document.querySelector('#pagination-previous');
    const currentBtn = document.querySelector('.pagination-list.is-current');

    previousBtn?.classList.toggle('is-disabled');
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, pageNumber=${this.pageNumber}`);

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // no category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set the pageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  updatePageSize(thePageSize: string) {
    this.pageSize = +thePageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

}
