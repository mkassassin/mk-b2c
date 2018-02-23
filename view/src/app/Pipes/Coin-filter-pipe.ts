import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'CoinFilterPipe',
})
export class CoinFilterPipe implements PipeTransform {
    transform(value: any, input: string) {
        if (input) {
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                return el['CoinName'].toLowerCase().indexOf(input) > -1;
            });
        }
        return value;
    }
}
