import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/country';
import { State } from 'src/app/models/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { WhitespaceValidator } from 'src/app/validators/whitespace-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // initialize Stripe API
  // stripe =

  checkoutFormGroup!: UntypedFormGroup;

  storage: Storage = sessionStorage;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  displayError: any = "";
  isDisabled: boolean = false;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private checkoutFormService: CheckoutFormService,
  ) { }

  ngOnInit(): void {

    // setup Stripe payment form
    // this.setupStripePaymentForm();

    this.reviewCartDetails();

    const email = JSON.parse(this.storage.getItem("userEmail")!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
        email: new FormControl(email, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
        state: new FormControl('', [
          Validators.required]
        ),
        country: new FormControl('', [
          Validators.required]
        ),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
        state: new FormControl('', [
          Validators.required]
        ),
        country: new FormControl('', [
          Validators.required]
        ),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WhitespaceValidator.notOnlyWhitespace]
        ),
      }),
      creditCard: this.formBuilder.group({

      })
    });

    this.checkoutFormService.getCountries().subscribe(
      (data) => {
        console.log("Retrieved countires: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm() {
    throw new Error('Method not implemented.');
  }

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  copyShippingAddressToBillingAdress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.checkoutFormService.getStates(countryCode).subscribe(
      (data) => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }



}
