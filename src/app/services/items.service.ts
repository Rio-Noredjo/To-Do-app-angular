import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ItemCategories } from '../class/item-categories';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Category} from "../class/category";

@Injectable({
  providedIn: 'root',
})

export class ItemsService {
  private allUserItemsUrl = environment.toDoApiUrl + '/items/all-user-items/';
  private allItemsUrl = environment.toDoApiUrl + '/items/all-items/';
  private deleteItemUrl = environment.toDoApiUrl + '/items/delete-item/';
  private categoriesUrl = environment.toDoApiUrl + '/categories';
  private addItemUrl = environment.toDoApiUrl + '/items/add/';
  private getItemUrl = environment.toDoApiUrl + '/items/get-item/';
  private updateItemUrl = environment.toDoApiUrl + '/items/update/';

  constructor(private httpClient: HttpClient) {}

  /** Retrieve items for a user based on userId.*/
  getUserItems(userId: number): Observable<ItemCategories[]> {
    return this.httpClient
      .get<ItemCategories[]>(this.allUserItemsUrl + userId)
      .pipe(map((response) => response));
  }

  /** Retrieve all items.*/
  getAllItems(): Observable<ItemCategories[]> {
    return this.httpClient
      .get<ItemCategories[]>(this.allItemsUrl)
      .pipe(map((response) => response));
  }

  /** Delete item based on itemId.*/
  deleteItem(itemId: number): Observable<number> {
    return this.httpClient
      .delete<number>(this.deleteItemUrl + itemId)
      .pipe(map((response) => response));
  }

  /** Retrieve all categories.*/
  getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<GetResponseCategories>(this.categoriesUrl)
      .pipe(map((response) => response._embedded.categories));
  }

  /** Retrieve item based on itemId.*/
  getItem(itemId: number): Observable<ItemCategories> {
    return this.httpClient
      .get<ItemCategories>(this.getItemUrl + itemId)
      .pipe(map((response) => response));
  }

  /** Update item*/
  updateItem(item: ItemCategories): Observable<any> {
    return this.httpClient
      .put<ItemCategories>(this.updateItemUrl, item)
      .pipe(map((response) => response));
  }

  /** Add item.*/
  addItem(item: ItemCategories, userId: number): Observable<any> {
    return this.httpClient
      .post<ItemCategories>(this.addItemUrl + userId, item)
      .pipe(map((response) => response));
  }
}

interface GetResponseCategories {
  _embedded: {
    categories: Category[];
  };
}
