import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmación';
  @Input() message = '¿Confirmas la acción?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Output() cancelAction = new EventEmitter<void>();
  @Output() confirmAction = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscKeyDown() {
    if(this.open) {this.cancelAction.emit();}
  }
}
