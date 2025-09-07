#!/usr/bin/env node

/**
 * Phoenix Development Environment Validation Script
 *
 * Validates that the development environment is properly configured
 * according to Engineering OS standards and Phoenix requirements.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ROOT = process.cwd();
const REQUIRED_NODE_VERSION = '22';
const MIN_NODE_VERSION = 22;

const errors = [];
const warnings = [];

// Check Node.js version
function validateNodeVersion() {
  const nodeVersion = parseInt(process.version.slice(1).split('.')[0], 10);
  if (nodeVersion < MIN_NODE_VERSION) {
    errors.push(
      `Node.js version too old. Expected: >=${MIN_NODE_VERSION}.x, Found: ${process.version}`
    );
  } else if (nodeVersion > parseInt(REQUIRED_NODE_VERSION, 10)) {
    warnings.push(
      `Node.js version newer than recommended. Recommended: ${REQUIRED_NODE_VERSION}.x, Found: ${process.version}`
    );
  } else {
  }
}

// Check package manager
function validatePackageManager() {
  try {
    const _pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
  } catch (_error) {
    errors.push('pnpm is not installed. Please install pnpm globally.');
  }
}

// Check required files
function validateRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'pnpm-workspace.yaml',
    'turbo.json',
    'tsconfig.json',
    'vitest.config.ts',
    'biome.json',
    '.nvmrc',
    '.env.example',
    '.husky/pre-commit',
    '.husky/pre-push',
    '.husky/commit-msg',
    '.husky/post-merge',
  ];

  requiredFiles.forEach((file) => {
    const filePath = join(PROJECT_ROOT, file);
    if (existsSync(filePath)) {
    } else {
      errors.push(`Missing required file: ${file}`);
    }
  });
}

// Check git hooks are executable
function validateGitHooks() {
  const hooks = ['pre-commit', 'pre-push', 'commit-msg', 'post-merge'];

  hooks.forEach((hook) => {
    const hookPath = join(PROJECT_ROOT, '.husky', hook);
    if (existsSync(hookPath)) {
      try {
        // Check if file is executable on Unix systems
        if (process.platform !== 'win32') {
          const stats = require('node:fs').statSync(hookPath);
          const isExecutable = (stats.mode & 0o0111) !== 0;
          if (isExecutable) {
          } else {
            warnings.push(`Git hook not executable: ${hook}. Run: chmod +x .husky/${hook}`);
          }
        } else {
        }
      } catch (_error) {
        warnings.push(`Could not check permissions for git hook: ${hook}`);
      }
    }
  });
}

// Check coverage configuration
function validateCoverageConfig() {
  try {
    const vitestConfigPath = join(PROJECT_ROOT, 'vitest.config.ts');
    const vitestConfig = readFileSync(vitestConfigPath, 'utf8');

    if (vitestConfig.includes('98')) {
    } else {
      warnings.push('98% coverage threshold not found in vitest.config.ts');
    }
  } catch (_error) {
    errors.push('Could not validate vitest configuration');
  }
}

// Check workspace packages
function validateWorkspacePackages() {
  const expectedPackages = [
    'packages/contracts',
    'packages/api',
    'packages/auth',
    'packages/database',
    'packages/ui',
    'packages/core',
    'apps/web',
  ];

  expectedPackages.forEach((pkg) => {
    const pkgPath = join(PROJECT_ROOT, pkg, 'package.json');
    if (existsSync(pkgPath)) {
    } else {
      errors.push(`Missing workspace package: ${pkg}`);
    }
  });
}

// Run all validations
function runValidation() {
  validateNodeVersion();
  validatePackageManager();
  validateRequiredFiles();
  validateGitHooks();
  validateCoverageConfig();
  validateWorkspacePackages();

  if (errors.length === 0 && warnings.length === 0) {
    process.exit(0);
  }

  if (warnings.length > 0) {
    warnings.forEach((_warning) => {});
  }

  if (errors.length > 0) {
    errors.forEach((_error) => {});
    process.exit(1);
  }

  if (warnings.length > 0 && errors.length === 0) {
    process.exit(0);
  }
}

// Execute validation
runValidation();
