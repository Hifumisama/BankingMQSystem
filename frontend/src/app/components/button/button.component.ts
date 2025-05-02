import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonTheme = 'primary' | 'secondary' | 'agreed' | 'denied';
export type ButtonSize = 'small' | 'large' | 'extra-large';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() theme: ButtonTheme = 'primary';
  @Input() size: ButtonSize = 'large';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const baseClasses = 'rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const themeClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
      agreed: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      denied: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    };

    const sizeClasses = {
      'small': 'px-3 py-1.5 text-sm',
      'large': 'px-4 py-2 text-base',
      'extra-large': 'px-8 py-3 text-lg w-[200px]'
    };

    return `${baseClasses} ${themeClasses[this.theme]} ${sizeClasses[this.size]} ${this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  }

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
