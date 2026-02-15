import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-pill',
  standalone: true,
  imports: [NgClass],
  template: `<span class="pill" [ngClass]="tone"><ng-content></ng-content></span>`,
  styleUrl: './pill.component.scss'
})
export class PillComponent {
  @Input() tone: string = '';
}
