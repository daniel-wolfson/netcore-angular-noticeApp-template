import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NoticePropertyDescriptions, Notice } from '../../models/notice.model';

@Component({
  selector: 'app-filter',
  templateUrl: './app-filter.component.html',
  styleUrls: ['./app-filter.component.scss'],
  standalone: true,
})
export class AppFilterComponent implements OnInit {
  searchTerm = '';
  filterBy = 'all';
  filterValue = 'all';
  filterProperty: keyof Notice = 'title';
  @ViewChild('addressInput') inputTextElement!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    // The ViewChild will be available after ngAfterViewInit, not in ngOnInit
  }

  ngAfterViewInit() {
    // Access the input element here
    if (this.inputTextElement) {
      // You can now safely use this.inputTextElement.nativeElement
    }
  }

  onGoClick() {
    // Logic for the go button click
  }

  onSelectChange($event: Event) {
    // get selected value
    debugger;
    const selectElement = $event.target as HTMLSelectElement;
    this.filterProperty = selectElement.value as keyof Notice;

    // todo: find element input type="text" class="address-input" and set placeholder
    //const inputElement = document.querySelector('.address-input') as HTMLInputElement;
    this.inputTextElement.nativeElement.placeholder = `Search by ${
      NoticePropertyDescriptions[this.filterProperty]
    }`;
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
  }

  openCreateForm() {
    // Logic to open the create form
  }

  onFilterChange(event: any): void {
    const value = event.target.value;

    if (value === 'all') {
      this.filterBy = 'all';
      this.filterValue = 'all';
    } else if (value === 'my') {
      this.filterBy = 'author';
      this.filterValue = 'my';
    } else if (value.startsWith('recent-')) {
      this.filterBy = 'recent';
      this.filterValue = value.split('-')[1];
    } else if (value === 'with-location') {
      this.filterBy = 'location';
      this.filterValue = 'with-location';
    }
  }
}
