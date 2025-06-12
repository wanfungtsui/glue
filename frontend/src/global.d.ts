// Global type declarations for Material Web Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Allow any md-* component with any props
      [key: `md-${string}`]: any;
      
      // Specific declarations for commonly used components
      'md-filled-card': any;
      'md-outlined-card': any;
      'md-filled-button': any;
      'md-outlined-button': any;
      'md-text-button': any;
      'md-icon-button': any;
      'md-icon': any;
      'md-circular-progress': any;
      'md-linear-progress': any;
      'md-outlined-text-field': any;
      'md-filled-text-field': any;
      'md-checkbox': any;
      'md-radio': any;
      'md-chip-set': any;
      'md-filter-chip': any;
      'md-input-chip': any;
      'md-tabs': any;
      'md-primary-tab': any;
      'md-secondary-tab': any;
      'md-dialog': any;
      'md-list': any;
      'md-list-item': any;
      'md-menu': any;
      'md-menu-item': any;
      'md-navigation-drawer': any;
      'md-navigation-rail': any;
      'md-slider': any;
    }
  }
}

// Allow importing JS modules
declare module '*.js' {
  const content: any;
  export default content;
}

// Extend React HTML attributes to allow custom properties
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: string]: any;
  }
}

export {}; 