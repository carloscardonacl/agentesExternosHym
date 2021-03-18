import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appColorsaldo]'
})
export class ColorsaldoDirective implements OnChanges {

  @Input() value:any;
  @Input() altColor:string;
  private _attrColor:string = 'gray';

  constructor(private elr:ElementRef) {

    this.SetAttrColor();
  }

  ngOnChanges(changes:SimpleChanges): void {
    this.SetAttrColor();    
  }

  private SetAttrColor(){
    if (this.altColor !== '' && this.altColor != undefined) {
      this._attrColor = this.altColor;  
    }else{
      this._attrColor = this.CheckSaldo(this.value);
    }    

    this.elr.nativeElement.style.color = this._attrColor;
  }

  private CheckSaldo(value:any){
    if (value !== undefined) {
      if (typeof(value) == 'string') {
        if (value !== '') {
          if (parseFloat(value)> 0) {
            return '#037501';
          }else if (parseFloat(value)< 0){
            return '#a00002';
          }else if (parseFloat(value)== 0){
            return '#888DA8';
          }
        }  
      }else if (typeof(value) == 'number') {
        if (value > 0) {
          return '#037501';
        }else if (value < 0){
          return '#a00002';
        }else if (value == 0){
          return '#888DA8';
        } 
      }
    }else{

      return 'gray';
    }
    
    
  }

}
