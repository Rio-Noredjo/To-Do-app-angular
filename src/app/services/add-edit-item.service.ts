import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../class/category';
import { environment } from '../../environments/environment';
import { ItemCategory } from '../class/item-category';

@Injectable({
  providedIn: 'root',
})
export class AddEditItemService {
  private categoriesUrl = environment.toDoApiUrl + '/categories';
  private addItemUrl = environment.toDoApiUrl + '/items/add/';
  private getItemUrl = environment.toDoApiUrl + '/items/get-item/';
  private updateItemUrl = environment.toDoApiUrl + '/items/update/';

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient
      .get<GetResponseCategories>(this.categoriesUrl)
      .pipe(map((response) => response._embedded.categories));
  }

  getItem(id: number): Observable<ItemCategory> {
    return this.httpClient
      .get<ItemCategory>(this.getItemUrl + id)
      .pipe(map((response) => response));
  }

  updateItem(item: ItemCategory): Observable<any> {
    return this.httpClient.put<ItemCategory>(this.updateItemUrl, item);
  }

  addItem(item: ItemCategory, userId: number): Observable<any> {
    return this.httpClient.post<ItemCategory>(this.addItemUrl + userId, item);
  }
}

interface GetResponseCategories {
  _embedded: {
    categories: Category[];
  };
}
