import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/items.service';
import { ItemCategories } from '../../class/item-categories';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  itemCategory: ItemCategories[] = [];
  userId: number;
  allItems: boolean;
  email: string;

  constructor(private itemsService: ItemsService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.allItems = !this.userId;
    this.email = sessionStorage.getItem('email');
    this.getItems();
  }

  /** Get all items.
   * if allItems is true retrieve all items from all users.
   * if allItems is false retrieve all items from a user*/
  private getItems(): void {
    if (this.allItems) {
      this.itemsService.getAllItems().subscribe({
        next: (response) => {
          this.itemCategory = response;
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    } else {
      this.itemsService.getUserItems(this.userId).subscribe({
        next: (response) => {
          this.itemCategory = response;
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    }
  }

  deleteItem(itemId: number): void {
    this.itemsService.deleteItem(itemId).subscribe({
      next: (response) => {
        this.ngOnInit();
        alert(`Item with id: ${response} successfully deleted`);
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      }
    });
  }
}
