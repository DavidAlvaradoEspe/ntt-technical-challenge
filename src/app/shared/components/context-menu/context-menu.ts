import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContextMenuItem {
  label: string;
  action: string;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
})
export class ContextMenu {
  @Input() items: ContextMenuItem[] = [];
  @Input() containerClass: string = '';
  @Output() itemClicked = new EventEmitter<string>();

  isVisible = false;
  positionX = 0;
  positionY = 0;
  private lastClickTarget: HTMLElement | null = null;

  constructor(private elementRef: ElementRef) {}

  show(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;

    if (this.isVisible && this.lastClickTarget === target) {
      this.hide();
      return;
    }

    this.lastClickTarget = target;
    this.updateMenuPosition(target);
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
    this.lastClickTarget = null;
  }

  onItemClick(action: string) {
    this.itemClicked.emit(action);
    this.hide();
  }

  private updateMenuPosition(buttonElement: HTMLElement) {
    const contextMenu = this.elementRef.nativeElement.querySelector('.context-menu');
    if (!contextMenu) return;

    const buttonRect = buttonElement.getBoundingClientRect();

    let posX = buttonRect.right;
    let posY = buttonRect.top;

    let container: HTMLElement | null = null;

    if (this.containerClass) {
      container = document.querySelector(`.${this.containerClass}`);
    }

    if (!container) {
      let parent = buttonElement.parentElement;
      while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          container = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }

    if (container) {
      const containerRect = container.getBoundingClientRect();
      const menuWidth = contextMenu.offsetWidth;
      const menuHeight = contextMenu.offsetHeight;

      if (posX + menuWidth > containerRect.right) {
        posX = buttonRect.left - menuWidth;
      }

      if (posY + menuHeight > containerRect.bottom) {
        posY = containerRect.bottom - menuHeight - 10;
      }

      if (posX < containerRect.left) {
        posX = containerRect.left + 10;
      }

      if (posY < containerRect.top) {
        posY = containerRect.top + 10;
      }
    } else {
      //fallback to window boundaries
      const menuWidth = contextMenu.offsetWidth;
      const menuHeight = contextMenu.offsetHeight;

      if (posX + menuWidth > window.innerWidth) {
        posX = buttonRect.left - menuWidth;
      }

      if (posY + menuHeight > window.innerHeight) {
        posY = window.innerHeight - menuHeight - 10;
      }
    }

    this.positionX = posX;
    this.positionY = posY;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isVisible &&
        !this.elementRef.nativeElement.contains(target) &&
        target !== this.lastClickTarget) {
      this.hide();
    }
  }
}
