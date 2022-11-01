import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ItemCategory } from '../class/item-category';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private allUserItemsUrl = environment.toDoApiUrl + '/items/all-user-items/';
  private allItemsUrl = environment.toDoApiUrl + '/items/all-items/';
  private deleteItemUrl = environment.toDoApiUrl + '/items/delete-item/';

  constructor(private httpClient: HttpClient) {}

  getUserItems(userId: number): Observable<ItemCategory[]> {
    return this.httpClient
      .get<ItemCategory[]>(this.allUserItemsUrl + userId)
      .pipe(map((response) => response));
  }

  getAllItems(): Observable<ItemCategory[]> {
    return this.httpClient
      .get<ItemCategory[]>(this.allItemsUrl)
      .pipe(map((response) => response));
  }

  deleteItem(id: number): Observable<number> {
    return this.httpClient
      .delete<number>(this.deleteItemUrl + id)
      .pipe(map((response) => response));
  }
}
