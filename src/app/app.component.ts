import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { DataService } from './core/data.service';
import { trigger, transition, keyframes, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('anim', [
      transition(':enter', [
        animate(500, keyframes([
          style({ background: '#fffbc5', offset: 0.5 }),
          style({ background: 'white', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('wrapper') wrapper: ElementRef;

  public data = [];
  public page = 1;
  public pageLength = 20;
  public filterTerm = '';

  private lastSort = {
    field: null,
    asc: true
  };
  private lastHeight = [0];
  private scrollerInit = false;

  constructor(
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataService.getData()
      .then((data: any) => {
        this.data = data.map((D, i) => {
          D.index = i;
          return D;
        });
      })
      .catch(err => console.log(err));
    this.dataService.subscribe(msg => {
      this.data = this.data.map(data => {
        if (data.short === msg.short) {
          return { index: data.index, ...msg };
        }
        return data;
      });
    });
  }

  ngAfterViewChecked() {
    if (this.wrapper && !this.scrollerInit) {
      this.scrollerInit = true;
      this.wrapper.nativeElement.addEventListener('scroll', event => {
        const top = event.target.scrollTop + event.target.clientHeight;
        const height = event.target.scrollHeight - 100;
        if (top >= height) {
          this.page++;
          this.lastHeight = [height, ...this.lastHeight];
        } else if (top <= this.lastHeight[0]) {
          this.page--;
          this.lastHeight = this.lastHeight.slice(1);
        }
      });
    } else if (!this.wrapper) {
      this.scrollerInit = false;
    }
  }

  sortBy(field) {
    this.lastSort.asc = this.lastSort.field === field ? !this.lastSort.asc : true;
    this.lastSort.field = field;
    this.data.sort((a, b) => {
      let order = a[field] < b[field] ? -1 : 1;
      order *= this.lastSort.asc ? 1 : -1;
      return order;
    });
  }

}
