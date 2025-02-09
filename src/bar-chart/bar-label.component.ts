import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    ElementRef,
    Output,
    EventEmitter
  } from '@angular/core';
import { formatLabel } from '../common/label.helper';

@Component({
  selector: 'g[ngx-charts-bar-label]',
  template: `  
    <svg:text   
      class="textDataLabel" 
      alignment-baseline="middle"     
      [attr.text-anchor]="textAnchor"
      [attr.transform]="transform"
      [attr.x]="x" 
      [attr.y]="y">
      {{formatedValue}}     
    </svg:text>          

  `,
  styleUrls: ['./bar-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

  export class BarLabelComponent implements OnChanges {

    @Input() value;
    @Input() valueFormatting: any;
    @Input() barX;
    @Input() barY;
    @Input() barWidth;
    @Input() barHeight;
    @Input() orientation;
    @Input() rotationAngle;

    @Output() dimensionsChanged: EventEmitter<any> = new EventEmitter();

    element: any;
    x: number;
    y: number;
    horizontalPadding: number = 2;
    verticalPadding: number = 7;
    formatedValue: string;
    transform: string;
    textAnchor: string;
    // rotationAngle: number = 0;

    constructor(element: ElementRef) {
      this.element = element.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges): void {
      this.update();
    }

    getSize(): any {
      const h = this.element.getBoundingClientRect().height;
      const w = this.element.getBoundingClientRect().width;
      return { height: h, width: w, negative: this.value < 0 };
    }

    ngAfterViewInit() {
      this.dimensionsChanged.emit(this.getSize());
    }

    update(): void {
      this.rotationAngle = this.rotationAngle ? this.rotationAngle : 0;
      // this.rotationAngle = this.rotationAngle ? this.rotationAngle : 0;
      if (this.valueFormatting) {
        this.formatedValue = this.valueFormatting(this.value);
      } else {
        this.formatedValue = formatLabel(this.value);
      }

      let dimension = this.getSize();

      if (this.orientation === 'horizontal') {
          this.x = this.barX + this.barWidth;
          // if the value is negative then it's on the left of the x0.
          // we need to put the data label in front of the bar
          if (this.value < 0) {
            this.x = this.x - this.horizontalPadding;
            this.textAnchor = 'end';
          } else {
            this.x = this.x + this.horizontalPadding;
            this.textAnchor = 'start';
          }
          this.y = this.barY + this.barHeight / 2;

      } else {
        if (this.rotationAngle === 0) {
          this.x = this.barX + (this.barWidth - dimension.width) / 2;
        } else {
          this.x = this.barX + this.barWidth / 2;
        }
        this.y = this.barY + this.barHeight;
        this.textAnchor = 'start';
        if (this.value < 0) {
          this.y = this.y + this.verticalPadding;
          this.textAnchor = this.rotationAngle ? 'end' : 'start';
        } else {
          this.y = this.y - this.verticalPadding;
        }

        this.transform = `rotate(${this.rotationAngle}, ${ this.x } , ${ this.y })`;
      }

    }
  }
