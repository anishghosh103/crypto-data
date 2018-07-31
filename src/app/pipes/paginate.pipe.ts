import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  pure: false
})
export class PaginatePipe implements PipeTransform {

  transform(list: any[], page?: number, pageLength?: number): any {
    if (!page) { return list; }
    if (!pageLength) { pageLength = 10; }
    return list.slice(0, page * pageLength);
  }

}
