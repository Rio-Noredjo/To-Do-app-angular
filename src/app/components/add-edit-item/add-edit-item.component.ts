import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { Status } from '../../enum/status';
import { Category } from '../../class/category';
import { Item } from '../../class/item';
import { ItemCategories } from '../../class/item-categories';
import { ActivatedRoute} from '@angular/router';
import { User } from '../../class/user';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-add-edit-item',
  templateUrl: './add-edit-item.component.html',
  styleUrls: ['./add-edit-item.component.css'],
})
export class AddEditItemComponent implements OnInit {
  addEditItemFormGroup: FormGroup;
  statuses: Status[] = [];
  categories: Category[] = [];
  itemId: number;
  itemCategories: ItemCategories[];
  itemCategory: ItemCategories;
  isAddMode: boolean;
  user: User;
  email: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private itemService: ItemsService,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.itemId = this.activatedRoute.snapshot.params['id'];
    this.isAddMode = !this.itemId;
    this.getCategories();
    this.getUserItems();
    this.setValueForEdit();
    this.addStatuses();

    this.addEditItemFormGroup = this.fb.group({
      title: ['',
        [Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]],
      content: ['',
        [Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]],
      category: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.addEditItemFormGroup.invalid) {
      this.addEditItemFormGroup.markAllAsTouched();
      return;
    }

    let item = this.setItem();
    this.submitItem(item);
  }

  get getTitle() { return this.addEditItemFormGroup.get('title'); }
  get getContent() { return this.addEditItemFormGroup.get('content'); }
  get getStatus() { return this.addEditItemFormGroup.get('status'); }
  get getCategory() { return this.addEditItemFormGroup.get('category'); }

  /** Retrieve the item if edit mode is active.
   * Put the item to ItemCategory class to use it in the addEditItemFormGroup.*/
  private setValueForEdit(): void {
    if (!this.isAddMode) {
      this.itemService.getItem(this.itemId).subscribe({
        next: (itemCategories) => {
          this.itemCategory = itemCategories;
          this.user = this.itemCategory.item.user;
          this.getTitle.setValue(this.itemCategory.item.title);
          this.getContent.setValue(this.itemCategory.item.content);
          for (let i in Status) {
            if (this.itemCategory.item.status == Status[i]) {
              this.getStatus.setValue(Status[i]);
            }
          }
          this.getCategory.setValue(this.itemCategory.categories);
        }, error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    }
  }

  /** Retrieve all categories from the Category table
   * to populate the data for the category dropdown.*/
  private getCategories(): void {
    this.itemService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      },
    });
  }

  /** Retrieve all items for the user.*/
  private getUserItems(): void {
    this.itemsService
      .getUserItems(Number(sessionStorage.getItem('userId')))
      .subscribe({
        next: (itemCategories) => {
          this.itemCategories = itemCategories;
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
  }

  /** Push all Status Enum to the statuses field.*/
  private addStatuses(): void {
    for (let i in Status) {
      this.statuses.push(Status[i]);
    }
  }

  /** Set form value to an Item object before saving the item.*/
  private setItem(): ItemCategories {
    let itemCategories = new ItemCategories();
    let item = new Item();
    item.title = this.getTitle.value;
    item.content = this.getContent.value;
    item.status = this.getStatus.value;

    if (!this.isAddMode) {
      item.user = this.user;
      item.id = this.itemId;
    }

    itemCategories.item = item;
    itemCategories.categories = this.getCategory.value;
    return itemCategories;
  }

  /** Update or add item.*/
  private submitItem(itemCategories : ItemCategories) {
    if (this.isAddMode) {
      this.itemService
        .addItem(itemCategories, Number(sessionStorage.getItem('userId')))
        .subscribe({
          next: (response) => {
            alert(`New Item added with id: ${response.id}`);
            this.ngOnInit();
          },
          error: (err) => {
            alert(`New Item added: ${err.error}`);
          }
        });
    } else {
      this.itemService.updateItem(itemCategories).subscribe({
        next: (response) => {
          this.ngOnInit();
          alert(`item updated with id: ${response.id}`);
        },
        error: (err) => {
          alert(`item updated: ${err.error}`);
        }
      });
    }

  }
}
