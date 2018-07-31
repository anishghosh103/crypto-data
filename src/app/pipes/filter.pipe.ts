import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: any[], term?: string): any {
    if (!term) { return list; }
    return list.filter(data => {
      return data.long.toLowerCase().includes(term.toLowerCase());
    });
  }

}
