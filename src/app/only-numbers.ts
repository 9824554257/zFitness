import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
})
export class OnlyNumbers {
  // Navigation keys allowed (e.g., Backspace, Arrow keys)
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
  ];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // Allow navigation keys and command keys (Ctrl/Cmd)
    if (this.navigationKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;

    // Prevent default if not a number
    if (isNaN(Number(e.key))) e.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    // Remove non-digit characters from pasted text
    const pastedInput = event.clipboardData?.getData('text/plain').replace(/\D/g, '') || '';
    this.el.nativeElement.value = pastedInput;
  }
}
