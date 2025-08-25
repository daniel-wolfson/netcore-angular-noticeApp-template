import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NoticePropertyDescriptions, Notice, NoticeFilter } from '../../models/notice.model';
import { EventDataService } from '../../services/data.service';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
})
export class SearchBarComponent {
  searchTerm = '';
  filterBy: keyof NoticeFilter = 'title';
  @ViewChild('searchBar') inputTextElement!: ElementRef<HTMLInputElement>;
  noticeProperties: [string, string][] = [];

  constructor(private eventDataService: EventDataService) {
    this.noticeProperties = Object.entries(NoticePropertyDescriptions);
  }

  ngAfterViewInit(): void {
    this.inputTextElement.nativeElement.placeholder = NoticePropertyDescriptions[this.filterBy];
  }

  createNotice(): void {
    this.eventDataService.addNotice();
  }

  onGoClick() {
    this.eventDataService.filterNotice(this.filterBy, this.searchTerm);
  }

  onSelectChange($event: Event) {
    const selectElement = $event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedText = selectedOption.text;
    this.filterBy = selectedText as keyof NoticeFilter;
    this.searchTerm = '';
    this.inputTextElement.nativeElement.placeholder = NoticePropertyDescriptions[this.filterBy];
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
  }
}
