// Global type declarations for Material Web Components

declare module '*.js' {
  const content: any;
  export default content;
}

declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: string]: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
    // Cards
    'md-filled-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-outlined-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    
    // Buttons
    'md-filled-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
      disabled?: boolean;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    };
    'md-outlined-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
      disabled?: boolean;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    };
    'md-text-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
      disabled?: boolean;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    };
    'md-icon-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
      disabled?: boolean;
      onClick?: React.MouseEventHandler<HTMLButtonElement>;
    };
    
    // Icons
    'md-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      slot?: string;
      children?: string;
    };
    
    // Progress
    'md-circular-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      indeterminate?: boolean;
      value?: number;
      max?: number;
    };
    'md-linear-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      indeterminate?: boolean;
      value?: number;
      max?: number;
    };
    
    // Form Controls
    'md-outlined-text-field': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
      label?: string;
      value?: string;
      type?: string;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
    };
    'md-filled-text-field': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
      label?: string;
      value?: string;
      type?: string;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
    };
    'md-checkbox': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
      checked?: boolean;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
    };
    'md-radio': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
      name?: string;
      checked?: boolean;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
    };
    
    // Chips
    'md-chip-set': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-filter-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      label?: string;
      selected?: boolean;
    };
    'md-input-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      label?: string;
    };
    
    // Tabs
    'md-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-primary-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      active?: boolean;
    };
    'md-secondary-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      active?: boolean;
    };
    
    // Dialogs
    'md-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      open?: boolean;
    };
    
    // Lists
    'md-list': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-list-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    
    // Menus
    'md-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      open?: boolean;
      anchor?: string;
    };
    'md-menu-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    
    // Navigation
    'md-navigation-drawer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'md-navigation-rail': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    
    // Sliders
    'md-slider': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
      min?: number;
      max?: number;
      step?: number;
      value?: number;
    };
  }
} 