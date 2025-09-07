/// <reference types="node" />
/// <reference types="vitest/globals" />

// Global type declarations for Phoenix monorepo

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PORT?: string;
      readonly DATABASE_URL?: string;
      readonly NEXT_PUBLIC_API_URL?: string;
      readonly NEXTAUTH_SECRET?: string;
      readonly NEXTAUTH_URL?: string;
    }
  }
}

// Module declarations for non-TypeScript files
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.module.css' {
  const content: Record<string, string>;
  export default content;
}

// Augment Vitest types for better test experience
declare module 'vitest' {
  export interface TestContext {
    // Custom test context properties can be added here
  }
}

export {};
