//my-products component.ts - Type Script file that contains code to render products to elearning application

//including the required files and services
import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


//component specific details 
@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})

//exporting MyProductsComponents 
export class MyProductsComponent implements OnInit {

  products: any;

  constructor(private data: DataService, private rest: RestApiService, private router: Router) {
  }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
          'http://localhost:3030/api/products'
      );
      data['success']
          ? (this.products = data['products'])
          : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async edit() {
    await this.router.navigateByUrl('/profile/postproduct');
  }

   async delete(id) {
    try {
    const data =  this.rest.get(
        `http://localhost:3030/api/deleteProduct/${id}`);
  }
  catch(error) {
    this.data.error(error['message']);
  }
    alert("Product deleted successfully");
    await this.router.navigateByUrl('/');
}
  getProducts() {
    try {
      const data =  this.rest.get(
          'http://localhost:3030/api/products'
      );
      data['success']
          ? (this.products = data['products'])
          : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
