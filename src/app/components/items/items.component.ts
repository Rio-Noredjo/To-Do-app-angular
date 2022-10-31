import { Component, OnInit } from '@angular/core';
import {ItemsService} from "../../services/items.service";
import {ItemCategory} from "../../class/item-category";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  itemCategory : ItemCategory[] = []
  userId : number;
  allItems: boolean
  constructor(private itemsService: ItemsService,
              private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.allItems = !this.userId
    this.retrieveItems();


  }

  retrieveItems(): void {
    if(this.allItems){
      this.itemsService.getAllItems().subscribe({
        next: (response) => {
          this.itemCategory = response
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    } else {
      this.itemsService.getUserItems(this.userId).subscribe({
        next: (response) => {
          this.itemCategory = response
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    }


  }

  deleteItem(id: number) {
    this.itemsService.deleteItem(id).subscribe({
      next: (response) => {
        this.ngOnInit()
        alert(`Item with id: ${response} successfully deleted`);
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      }
    });

  }
}
