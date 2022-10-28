import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../validators/custom-validators";
import {Status} from "../../enum/status";
import {Category} from "../../class/category";
import {AddEditItemService} from "../../services/add-edit-item.service";
import {Item} from "../../class/item";
import {ItemCategory} from "../../class/item-category";

@Component({
  selector: 'app-add-edit-to-do-item',
  templateUrl: './add-edit-to-do-item.component.html',
  styleUrls: ['./add-edit-to-do-item.component.css']
})
export class AddEditToDoItemComponent implements OnInit {
  addEditItemFormGroup: FormGroup;
  statuses : Status[] = []
  categories : Category[] = []

  constructor( private fb: FormBuilder,
               private addEditItemService : AddEditItemService) { }

  ngOnInit(): void {
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
    itemCategory.item = item
    itemCategory.categories = this.getCategory.value

    this.addEditItemService.addItem(itemCategory,2).subscribe({
      next: (response) => {
        window.location.reload();
        alert(`New Item added: ${response.item.id}`);
      },
      error: (err) => {
        alert(`New Item added: ${err.error}`);
      },
    });
  }

  get getTitle() { return this.addEditItemFormGroup.get('title'); }
  get getContent() { return this.addEditItemFormGroup.get('content'); }
  get getStatus() { return this.addEditItemFormGroup.get('status'); }
  get getCategory() { return this.addEditItemFormGroup.get('category'); }

}
