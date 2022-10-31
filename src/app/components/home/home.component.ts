import { Component, OnInit } from '@angular/core';
import {ItemsService} from "../../services/items.service";
import {ItemCategory} from "../../class/item-category";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  itemCategory : ItemCategory[] = []
  isLogedIn : boolean
  email : string
  userId : number
  message:string="";
  approvalText:string="";
  constructor (private itemsService: ItemsService) {
  }

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email')
    this.itemsService.getUserItems(Number(sessionStorage.getItem('userId'))).subscribe({
      next: (response) => {
        this.itemCategory = response
        this.itemCategory.forEach(function (item){
          var myString= item.item.lastUpdated
          item.item.lastUpdated = myString.substring(0,myString.indexOf('T'))
        })

      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      }
    });
  }

}
