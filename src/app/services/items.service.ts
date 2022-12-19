import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Category} from "../class/category";
import {ItemCategories} from "../class/item-categories";

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

  getUserItems(userId: number): Observable<ItemCategories[]> {
    return this.httpClient
      .get<ItemCategories[]>(this.allUserItemsUrl + userId)
      .pipe(map((response) => response));
  }

  getAllItems(): Observable<ItemCategories[]> {
    return this.httpClient
      .get<ItemCategories[]>(this.allItemsUrl)
      .pipe(map((response) => response));
  }

  deleteItem(itemId: number): Observable<number> {
    return this.httpClient
      .delete<number>(this.deleteItemUrl + itemId)
      .pipe(map((response) => response));
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<GetResponseCategories>(this.categoriesUrl)
      .pipe(map((response) => response._embedded.categories));
  }

  getItem(itemId: number): Observable<ItemCategories> {
    return this.httpClient
      .get<ItemCategories>(this.getItemUrl + itemId)
      .pipe(map((response) => response));
  }

  updateItem(item: ItemCategories): Observable<any> {
    return this.httpClient
      .put<ItemCategories>(this.updateItemUrl, item)
      .pipe(map((response) => response));
  }

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
