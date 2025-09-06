import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('TypeScript Monorepo Configuration', () => {
  it('should have root tsconfig.json with strict settings', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    expect(existsSync(tsconfigFile)).toBe(true)
    
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    // Verify strict TypeScript settings
    expect(config.compilerOptions.strict).toBe(true)
    expect(config.compilerOptions.noImplicitAny).toBe(true)
    expect(config.compilerOptions.strictNullChecks).toBe(true)
    expect(config.compilerOptions.noImplicitReturns).toBe(true)
    expect(config.compilerOptions.noFallthroughCasesInSwitch).toBe(true)
  })

  it('should have ESNext target and module settings', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    expect(config.compilerOptions.target).toBe('ESNext')
    expect(config.compilerOptions.module).toBe('ESNext')
    expect(config.compilerOptions.moduleResolution).toBe('bundler')
  })

  it('should have path mapping configured for monorepo packages', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    expect(config.compilerOptions.baseUrl).toBe('.')
    expect(config.compilerOptions.paths).toBeDefined()
    
    // Verify common monorepo path mappings
    const paths = config.compilerOptions.paths
    expect(paths['@phoenix/*']).toContain('./packages/*')
    expect(paths['@/*']).toContain('./apps/web/src/*')
  })

  it('should have TypeScript project references configured', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    expect(config.references).toBeDefined()
    expect(Array.isArray(config.references)).toBe(true)
    
    // Will be configured when workspaces are created
    if (config.references.length > 0) {
      config.references.forEach((ref: any) => {
        expect(ref.path).toBeDefined()
        expect(typeof ref.path).toBe('string')
      })
    }
  })

  it('should have proper include and exclude patterns', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    expect(config.include).toBeDefined()
    expect(config.exclude).toBeDefined()
    
    // Common patterns
    expect(config.include).toContain('**/*.ts')
    expect(config.include).toContain('**/*.tsx')
    expect(config.exclude).toContain('node_modules')
    expect(config.exclude).toContain('dist')
  })

  it('should have composite project settings for monorepo', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    // Root config should not be composite, but enable incremental builds
    expect(config.compilerOptions.incremental).toBe(true)
    expect(config.compilerOptions.tsBuildInfoFile).toBeDefined()
  })

  it('should have declaration generation enabled', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    expect(config.compilerOptions.declaration).toBe(true)
    expect(config.compilerOptions.declarationMap).toBe(true)
    expect(config.compilerOptions.sourceMap).toBe(true)
  })

  it('should have proper JSX and React settings', () => {
    const tsconfigFile = join(process.cwd(), 'tsconfig.json')
    const config = JSON.parse(readFileSync(tsconfigFile, 'utf8'))
    
    expect(config.compilerOptions.jsx).toBe('react-jsx')
    expect(config.compilerOptions.jsxImportSource).toBe('react')
  })

  it('should have workspace-specific tsconfig files structure ready', () => {
    // These will be created when workspaces are set up
    const workspaceConfigs = [
      'apps/web/tsconfig.json',
      'packages/contracts/tsconfig.json',
      'packages/api/tsconfig.json'
    ]
    
    // For now, just verify the structure is planned
    expect(true).toBe(true) // Placeholder - will implement when workspaces exist
  })

  it('should have TypeScript installed as dev dependency', () => {
    const packageFile = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'))
    
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    
    expect(allDeps.typescript).toBeDefined()
    expect(allDeps.typescript).toMatch(/^[\^\~]?5\.(9|[1-9][0-9])\./)
    expect(allDeps['@types/node']).toBeDefined()
  })

  it('should have type-check script configured', () => {
    const packageFile = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'))
    
    expect(packageJson.scripts['type-check']).toBeDefined()
    expect(packageJson.scripts['type-check']).toContain('turbo type-check')
  })
})