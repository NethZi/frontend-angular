import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

//component specific details
@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})

export class PostProductComponent implements OnInit {

  product = {
    title: '',
    price: 0,
    stock: 0,
    categoryId: '',
    description: '',
    file: null
  };

  categories: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.stock) {
          if (product.categoryId) {
            if (product.description) {
              if (product.file) {
                return true;
              } else {
                this.data.error('Please select product image.');
              }
            } else {
              this.data.error('Please enter description.');
            }
          } else {
            this.data.error('Please select category.');
          }
        } else {
          this.data.error('Please enter a stock value.');
        }
      } else {
        this.data.error('Please enter a price.');
      }
    } else {
      this.data.error('Please enter a title.');
    }

  }

  fileChange(event: any) {
    this.product.file = event.target.files[0];
  }

  async post() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.product)) {
        const form = new FormData();
        for (const key in this.product) {
          if (this.product.hasOwnProperty(key)) {
            if (key === 'product_picture') {
              form.append(
                'product_picture',
                this.product.file,
                this.product.file.name
              );
            } else {
              form.append(key, this.product[key]);
            }
          }
        }
        const data = await this.rest.post(
          'http://localhost:3030/api/product',
          form
        );
        data['_id']
          ? this.router.navigate(['/'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
