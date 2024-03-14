import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'europeNumber',
  standalone: true
})
export class EuropeNumberPipe implements PipeTransform {

  transform(value: number): string {
    const numeroFormateado = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${numeroFormateado} €`;
  }

}
