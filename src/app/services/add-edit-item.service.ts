import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Category} from "../class/category";
import {environment} from "../../environments/environment";
import {ItemCategory} from "../class/item-category";

@Injectable({
  providedIn: 'root'
})
export class AddEditItemService {
  private categoriesUrl = environment.toDoApiUrl + '/categories';
  private addItemUrl = environment.toDoApiUrl + '/items/add/';

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<GetResponseCategories>(this.categoriesUrl)
      .pipe(map((response) => response._embedded.categories));
  }

  addItem(item: ItemCategory, userId : number): Observable<ItemCategory> {
    return this.httpClient.post<ItemCategory>(this.addItemUrl+userId, item);
  }

}

interface GetResponseCategories {
  _embedded: {
    categories: Category[];
  };
}
