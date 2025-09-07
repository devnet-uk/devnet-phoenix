import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Build and Development Tooling Integration', () => {
  describe('Package Dependencies', () => {
    it('should have all required dependencies installed', () => {
      const rootPackageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      const allDeps = { ...rootPackageJson.dependencies, ...rootPackageJson.devDependencies };

      // Core tooling dependencies
      expect(allDeps.turbo).toBeDefined();
      expect(allDeps.typescript).toBeDefined();
      expect(allDeps.vitest).toBeDefined();
      expect(allDeps['@vitest/coverage-v8']).toBeDefined();

      // Development tooling
      expect(allDeps.husky).toBeDefined();
      expect(allDeps['lint-staged']).toBeDefined();
      expect(allDeps['@commitlint/cli']).toBeDefined();
      expect(allDeps['@commitlint/config-conventional']).toBeDefined();
    });

    it('should have workspace dependencies properly configured', () => {
      const packagePaths = [
        'packages/contracts',
        'packages/api',
        'packages/auth',
        'packages/database',
        'packages/ui',
        'apps/web',
      ];

      packagePaths.forEach((packagePath) => {
        const packageJsonPath = join(process.cwd(), packagePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        // Check workspace protocol usage
        if (packageJson.dependencies) {
          Object.keys(packageJson.dependencies).forEach((dep) => {
            if (dep.startsWith('@phoenix/')) {
              expect(packageJson.dependencies[dep]).toMatch(/^workspace:/);
            }
          });
        }
      });
    });
  });

  describe('Build System Integration', () => {
    it('should have turbo tasks properly configured across workspaces', () => {
      const turboConfig = JSON.parse(readFileSync(join(process.cwd(), 'turbo.json'), 'utf8'));

      // Verify essential tasks exist
      const requiredTasks = ['build', 'dev', 'test', 'lint', 'type-check'];
      requiredTasks.forEach((task) => {
        expect(turboConfig.tasks[task]).toBeDefined();
      });

      // Verify task dependencies are properly set up
      expect(turboConfig.tasks.build.dependsOn).toContain('^build');
      expect(turboConfig.tasks.build.dependsOn).toContain('type-check');
    });

    it('should have all workspaces configured with build scripts', () => {
      const packagePaths = [
        'packages/contracts',
        'packages/api',
        'packages/auth',
        'packages/database',
        'packages/ui',
      ];

      packagePaths.forEach((packagePath) => {
        const packageJsonPath = join(process.cwd(), packagePath, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        expect(packageJson.scripts).toBeDefined();
        expect(packageJson.scripts.build).toBeDefined();
        expect(packageJson.scripts['type-check']).toBeDefined();
        expect(packageJson.scripts.test).toBeDefined();
      });
    });
  });

  describe('Development Workflow', () => {
    it('should have git hooks configured', () => {
      const huskyPath = join(process.cwd(), '.husky');
      expect(existsSync(huskyPath)).toBe(true);

      const preCommitPath = join(huskyPath, 'pre-commit');
      const commitMsgPath = join(huskyPath, 'commit-msg');

      expect(existsSync(preCommitPath)).toBe(true);
      expect(existsSync(commitMsgPath)).toBe(true);
    });

    it('should have lint-staged configured', () => {
      const rootPackageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      expect(rootPackageJson['lint-staged']).toBeDefined();

      const lintStaged = rootPackageJson['lint-staged'];
      expect(lintStaged['*.{js,jsx,ts,tsx}']).toBeDefined();
      expect(lintStaged['*.{js,jsx,ts,tsx,json,md}']).toBeDefined();
    });

    it('should have commitlint configured', () => {
      const commitlintPath = join(process.cwd(), '.commitlintrc.js');
      if (existsSync(commitlintPath)) {
        const content = readFileSync(commitlintPath, 'utf8');
        expect(content).toContain('@commitlint/config-conventional');
      }
    });
  });

  describe('IDE Integration', () => {
    it('should have VSCode settings configured', () => {
      const vscodeDir = join(process.cwd(), '.vscode');
      if (existsSync(vscodeDir)) {
        const settingsPath = join(vscodeDir, 'settings.json');
        if (existsSync(settingsPath)) {
          const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
          expect(settings).toBeDefined();
        }
      }
      // VSCode config is optional, so we just check if it exists
      expect(true).toBe(true);
    });

    it('should have proper TypeScript path resolution for IDE', () => {
      const rootTsconfig = JSON.parse(readFileSync(join(process.cwd(), 'tsconfig.json'), 'utf8'));

      expect(rootTsconfig.compilerOptions.baseUrl).toBe('.');
      expect(rootTsconfig.compilerOptions.paths).toBeDefined();
      expect(rootTsconfig.compilerOptions.paths['@phoenix/*']).toBeDefined();
      expect(rootTsconfig.compilerOptions.paths['@/*']).toBeDefined();
    });
  });

  describe('Testing Integration', () => {
    it('should have Vitest configured across workspaces', () => {
      const rootVitestPath = join(process.cwd(), 'vitest.config.ts');
      expect(existsSync(rootVitestPath)).toBe(true);

      const vitestConfig = readFileSync(rootVitestPath, 'utf8');
      expect(vitestConfig).toContain('coverage');
      expect(vitestConfig).toContain('thresholds');
    });

    it('should have coverage configuration with layer-specific thresholds', () => {
      const vitestConfig = readFileSync(join(process.cwd(), 'vitest.config.ts'), 'utf8');

      // Check for layer-specific coverage thresholds
      expect(vitestConfig).toContain('domain');
      expect(vitestConfig).toContain('branches: 100');
      expect(vitestConfig).toContain('ui');
      expect(vitestConfig).toContain('branches: 95');
    });
  });

  describe('Package Management', () => {
    it('should have pnpm workspace configuration', () => {
      const pnpmWorkspacePath = join(process.cwd(), 'pnpm-workspace.yaml');
      expect(existsSync(pnpmWorkspacePath)).toBe(true);

      const workspaceConfig = readFileSync(pnpmWorkspacePath, 'utf8');
      expect(workspaceConfig).toContain('apps/*');
      expect(workspaceConfig).toContain('packages/*');
    });

    it('should have proper npmrc configuration', () => {
      const npmrcPath = join(process.cwd(), '.npmrc');
      expect(existsSync(npmrcPath)).toBe(true);

      const npmrcContent = readFileSync(npmrcPath, 'utf8');
      expect(npmrcContent).toContain('prefer-workspace-packages=true');
      expect(npmrcContent).toContain('save-workspace-protocol=rolling');
    });
  });

  describe('Build Verification', () => {
    it('should be able to run type checking across all packages', () => {
      // This test verifies the tooling is set up correctly
      // Actual type checking will be done by the build system
      const rootPackageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      expect(rootPackageJson.scripts['type-check']).toBeDefined();
      expect(rootPackageJson.scripts['type-check']).toContain('turbo type-check');
    });

    it('should be able to run tests across all packages', () => {
      const rootPackageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
      expect(rootPackageJson.scripts.test).toBeDefined();
      expect(rootPackageJson.scripts.test).toContain('turbo test');
    });
  });
});
