import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appLatitudeMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: LatitudeMaskDirective,
    multi: true
  }]
})
export class LatitudeMaskDirective implements ControlValueAccessor {

  onTouched: any;
  onChange: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) {
  }

  writeValue(value: any): void {
    if (value) {
      const valor = this.formatar(value);
      this.elementRef.nativeElement.value = valor;
      this.ngModelChange.emit(valor);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput($event: any) {
    const valor = $event.target.value.replace( /\s/g, '').replace(/\,/g, '.');
    if (valor.length <= 10) {

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }

    $event.target.value = this.formatar(valor);
    this.ngModelChange.emit($event.target.value);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    const valor = $event.target.value.replace( /\s/g, '').replace(/\,/g, '.');
    $event.target.value = this.formatar(valor);
    this.ngModelChange.emit($event.target.value);
  }

  formatar(valor) {
    let newValor = '';
    for (let i = 0; i < valor.length; i++) {
      if (i === 0 && (valor[i] === '+' || valor[i] === '-')) {
        newValor = valor[i];
      } else if (i > 0) {
        if (i === 1 && isNaN(valor[i])) {
          newValor = '';
          break;
        } else {
          if (!isNaN(valor[i]) && (i !== 0 && i !== 2 && i !== 3)) {
            if (((i <= 9) && (newValor[2] !== '.')) && !isNaN(valor[i])) {
              newValor += valor[i];
            } else if ((i <= 8) && !isNaN(valor[i])) {
              newValor += valor[i];
            } else {
              break;
            }
          } else if (i === 2 && (!isNaN(valor[i]) || valor[i] === '.')) {
            newValor += valor[i];
          } else if (i === 3 && (!isNaN(valor[i]) || valor[i] === '.')) {
            if (!isNaN(valor[i - 1]) === !isNaN(valor[i])) {
              if (!isNaN(valor[i])) {
                newValor += `.${valor[i]}`;
              } else {
                break;
              }
            } else {
              newValor += valor[i];
            }
          }
        }
      } else {
        break;
      }
    }
    return newValor;
  }

}
