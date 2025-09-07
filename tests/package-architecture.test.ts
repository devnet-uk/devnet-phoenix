import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Package Architecture Foundation', () => {
  const workspacePackages = [
    'packages/contracts',
    'packages/api',
    'packages/auth',
    'packages/database',
    'packages/ui',
  ];

  const workspaceApps = ['apps/web'];

  describe('Package Structure', () => {
    it('should have all required package directories', () => {
      workspacePackages.forEach((packagePath) => {
        const fullPath = join(process.cwd(), packagePath);
        expect(existsSync(fullPath)).toBe(true);
        expect(statSync(fullPath).isDirectory()).toBe(true);
      });
    });

    it('should have all required app directories', () => {
      workspaceApps.forEach((appPath) => {
        const fullPath = join(process.cwd(), appPath);
        expect(existsSync(fullPath)).toBe(true);
        expect(statSync(fullPath).isDirectory()).toBe(true);
      });
    });
  });

  describe('Package.json Structure', () => {
    it('should have package.json in each workspace', () => {
      [...workspacePackages, ...workspaceApps].forEach((workspacePath) => {
        const packageJsonPath = join(process.cwd(), workspacePath, 'package.json');
        expect(existsSync(packageJsonPath)).toBe(true);

        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        expect(packageJson.name).toBeDefined();
        expect(packageJson.version).toBeDefined();
        expect(packageJson.type).toBe('module');
      });
    });

    it('should have correct package naming convention', () => {
      workspacePackages.forEach((packagePath) => {
        const packageJsonPath = join(process.cwd(), packagePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        const expectedName = `@phoenix/${packagePath.split('/')[1]}`;
        expect(packageJson.name).toBe(expectedName);
      });
    });

    it('should have correct app naming convention', () => {
      workspaceApps.forEach((appPath) => {
        const packageJsonPath = join(process.cwd(), appPath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        const expectedName = `@phoenix/${appPath.split('/')[1]}`;
        expect(packageJson.name).toBe(expectedName);
      });
    });
  });

  describe('TypeScript Configuration', () => {
    it('should have tsconfig.json in each workspace', () => {
      [...workspacePackages, ...workspaceApps].forEach((workspacePath) => {
        const tsconfigPath = join(process.cwd(), workspacePath, 'tsconfig.json');
        expect(existsSync(tsconfigPath)).toBe(true);

        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
        expect(tsconfig.extends).toBe('../../tsconfig.json');
        expect(tsconfig.compilerOptions).toBeDefined();
      });
    });

    it('should have composite configuration for packages', () => {
      workspacePackages.forEach((packagePath) => {
        const tsconfigPath = join(process.cwd(), packagePath, 'tsconfig.json');
        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));

        // Packages should be composite for project references
        expect(tsconfig.compilerOptions.composite).toBe(true);
        expect(tsconfig.compilerOptions.outDir).toBe('dist');
        expect(tsconfig.compilerOptions.rootDir).toBe('src');
      });
    });
  });

  describe('Source Structure', () => {
    it('should have src directory in each workspace', () => {
      [...workspacePackages, ...workspaceApps].forEach((workspacePath) => {
        const srcPath = join(process.cwd(), workspacePath, 'src');
        expect(existsSync(srcPath)).toBe(true);
        expect(statSync(srcPath).isDirectory()).toBe(true);
      });
    });

    it('should have index.ts in package src directories', () => {
      workspacePackages.forEach((packagePath) => {
        const indexPath = join(process.cwd(), packagePath, 'src', 'index.ts');
        expect(existsSync(indexPath)).toBe(true);
      });
    });
  });

  describe('Build Configuration', () => {
    it('should have build scripts configured for packages', () => {
      workspacePackages.forEach((packagePath) => {
        const packageJsonPath = join(process.cwd(), packagePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        expect(packageJson.scripts).toBeDefined();
        expect(packageJson.scripts.build).toBeDefined();
        expect(packageJson.scripts['type-check']).toBeDefined();
      });
    });

    it('should have proper main and types fields', () => {
      workspacePackages.forEach((packagePath) => {
        const packageJsonPath = join(process.cwd(), packagePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        expect(packageJson.main).toBe('dist/index.js');
        expect(packageJson.types).toBe('dist/index.d.ts');
        expect(packageJson.exports).toBeDefined();
      });
    });
  });

  describe('Workspace Dependencies', () => {
    it('should have contracts package as dependency in other packages', () => {
      const dependentPackages = ['packages/api', 'packages/auth', 'packages/database'];

      dependentPackages.forEach((packagePath) => {
        const packageJsonPath = join(process.cwd(), packagePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies,
        };

        expect(allDeps['@phoenix/contracts']).toBeDefined();
      });
    });

    it('should have workspace protocol for internal dependencies', () => {
      [...workspacePackages, ...workspaceApps].forEach((workspacePath) => {
        const packageJsonPath = join(process.cwd(), workspacePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        const deps = packageJson.dependencies || {};
        Object.keys(deps).forEach((dep) => {
          if (dep.startsWith('@phoenix/')) {
            expect(deps[dep]).toMatch(/^workspace:/);
          }
        });
      });
    });
  });

  describe('Root Workspace Configuration', () => {
    it('should have updated workspace references in root tsconfig', () => {
      const rootTsconfigPath = join(process.cwd(), 'tsconfig.json');
      const rootTsconfig = JSON.parse(readFileSync(rootTsconfigPath, 'utf8'));

      expect(rootTsconfig.references).toBeDefined();
      expect(Array.isArray(rootTsconfig.references)).toBe(true);

      const expectedReferences = [
        ...workspacePackages.map((p) => ({ path: `./${p}` })),
        ...workspaceApps.map((p) => ({ path: `./${p}` })),
      ];

      expect(rootTsconfig.references).toEqual(expectedReferences);
    });
  });
});
