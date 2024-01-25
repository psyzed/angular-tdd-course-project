import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styles: ``,
})
export class ButtonComponent {
  @Input() public disabled = false;
  @Input() public isLoading = false;
  @Input() public text = '';
  @Output() public onClicked = new EventEmitter();

  onClick(): void {
    this.onClicked.emit();
  }
}
