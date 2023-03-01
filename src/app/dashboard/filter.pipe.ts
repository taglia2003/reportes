import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string) {
    if (!items) return [];
    if (!value || value.length == 0) return items;
    return items.filter( it => it[field] === value).length;
  }
}
