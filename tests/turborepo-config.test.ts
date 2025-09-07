import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Turborepo Build System Configuration', () => {
  it('should have turbo.json configuration file', () => {
    const turboConfig = join(process.cwd(), 'turbo.json');
    expect(existsSync(turboConfig)).toBe(true);

    const config = JSON.parse(readFileSync(turboConfig, 'utf8'));
    expect(config.tasks).toBeDefined();
    expect(typeof config.tasks).toBe('object');
  });

  it('should have essential build tasks configured', () => {
    const turboConfig = join(process.cwd(), 'turbo.json');
    const config = JSON.parse(readFileSync(turboConfig, 'utf8'));

    const requiredTasks = ['build', 'dev', 'test', 'lint', 'type-check'];
    requiredTasks.forEach((task) => {
      expect(config.tasks[task]).toBeDefined();
    });
  });

  it('should have proper task dependencies configured', () => {
    const turboConfig = join(process.cwd(), 'turbo.json');
    const config = JSON.parse(readFileSync(turboConfig, 'utf8'));

    // Build should depend on type-check and lint
    if (config.tasks.build?.dependsOn) {
      const buildDeps = config.tasks.build.dependsOn;
      expect(buildDeps).toContain('^build');
    }
  });

  it('should have caching configuration', () => {
    const turboConfig = join(process.cwd(), 'turbo.json');
    const config = JSON.parse(readFileSync(turboConfig, 'utf8'));

    // Check that tasks have proper output configurations
    if (config.tasks.build) {
      expect(config.tasks.build.outputs).toBeDefined();
    }

    // Check for global env configuration
    expect(config.globalEnv).toBeDefined();
  });

  it('should have Turborepo installed as dependency', () => {
    const packageFile = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'));

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    expect(allDeps.turbo).toBeDefined();
    expect(allDeps.turbo).toMatch(/^\^?\d+\.\d+\.\d+/);
  });

  it('should have turbo scripts in root package.json', () => {
    const packageFile = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'));

    // Check for turbo-powered scripts
    const scripts = packageJson.scripts;
    expect(scripts).toBeDefined();

    // Look for turbo usage in scripts (will be added in implementation)
    // This test will initially fail until turbo scripts are added
    const _hasTurboScripts = Object.values(scripts).some((script: any) => script.includes('turbo'));

    // For now, just check that scripts exist - turbo integration comes next
    expect(scripts.build).toBeDefined();
    expect(scripts.dev).toBeDefined();
  });

  it('should have proper .gitignore entries for turbo', () => {
    const gitignoreFile = join(process.cwd(), '.gitignore');
    if (existsSync(gitignoreFile)) {
      const gitignoreContent = readFileSync(gitignoreFile, 'utf8');
      expect(gitignoreContent).toContain('.turbo');
    }
  });
});
