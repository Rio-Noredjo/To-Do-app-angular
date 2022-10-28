import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../validators/custom-validators";
import {Status} from "../../enum/status";
import {Category} from "../../class/category";
import {AddEditItemService} from "../../services/add-edit-item.service";
import {Item} from "../../class/item";
import {ItemCategory} from "../../class/item-category";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../class/user";

@Component({
  selector: 'app-add-edit-to-do-item',
  templateUrl: './add-edit-to-do-item.component.html',
  styleUrls: ['./add-edit-to-do-item.component.css']
})
export class AddEditToDoItemComponent implements OnInit {
  addEditItemFormGroup: FormGroup;
  statuses : Status[] = []
  categories : Category[] = []
  itemId: number
  itemCategory: ItemCategory
  isAddMode: boolean;
  user: User;

  constructor( private fb: FormBuilder,
               private route: ActivatedRoute,
               private addEditItemService : AddEditItemService) { }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.params['id'];
    this.isAddMode = !this.itemId;

    if(!this.isAddMode){
      this.addEditItemService.getItem(this.itemId).subscribe((response) => {
        this.itemCategory = response;
        this.user = this.itemCategory.item.user
          this.getTitle.setValue(this.itemCategory.item.title)
        this.getContent.setValue(this.itemCategory.item.content)
        for (let i in Status) {
          if(this.itemCategory.item.status == Status[i]){
            this.getStatus.setValue(Status[i])
          }
        }
        this.getCategory.setValue(this.itemCategory.categories);
      });
    }

    for (let i in Status) {
      this.statuses.push(Status[i]);
    }

    this.addEditItemService.getCategories().subscribe((response) => {
      this.categories = response;
    });

    this.addEditItemFormGroup = this.fb.group({
      title: ['',
        [Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]],
      content: ['',
        [Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace]],
      category: ['',
        [Validators.required]],
      status: ['',
        [Validators.required,
        ]]
    })
  }

  onSubmit() {
    let itemCategory = new ItemCategory();
    let item = new Item()
    item.title = this.getTitle.value
    item.content = this.getContent.value
    item.status = this.getStatus.value
    if(!this.isAddMode){
      item.user = this.user
      item.id = this.itemId
    }
    itemCategory.item = item
    itemCategory.categories = this.getCategory.value

    if(this.isAddMode){
      this.addEditItemService.addItem(itemCategory,2).subscribe({
        next: (response) => {
          this.ngOnInit();
          alert(`New Item added: ${response.id}`);
        },
        error: (err) => {
          alert(`New Item added: ${err.error}`);
        },
      });
    } else {
      this.addEditItemService.updateItem(itemCategory).subscribe({
        next: (response) => {
          this.ngOnInit();
          console.log(response.id)
          alert(`item updated: ${response.id}`);
        },
        error: (err) => {
          alert(`item updated: ${err.error}`);
        },
      });
    }
  }

  get getTitle() { return this.addEditItemFormGroup.get('title'); }
  get getContent() { return this.addEditItemFormGroup.get('content'); }
  get getStatus() { return this.addEditItemFormGroup.get('status'); }
  get getCategory() { return this.addEditItemFormGroup.get('category'); }

}
