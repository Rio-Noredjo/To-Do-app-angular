import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/items.service';
import { ItemCategories } from '../../class/item-categories';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enum/user-role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  itemCategory: ItemCategories[] = [];
  email: string;
  userId: number;

  constructor(private itemsService: ItemsService,
              public authService: AuthService) {}

  get UserRoleResult(): typeof UserRole {
    return UserRole;
  }

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email');
    this.getUserItems();
  }

  /** Get all items based on userId.*/
  private getUserItems(): void {
    this.itemsService.getUserItems(Number(sessionStorage.getItem('userId')))
      .subscribe({
        next: (response) => {
          this.itemCategory = response;
          this.itemCategory.forEach(function (item) {
            let tempLastUpdated = item.item.lastUpdated;
            item.item.lastUpdated = tempLastUpdated.substring( 0, tempLastUpdated.indexOf('.'));
          });
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
  }
}
