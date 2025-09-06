import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('pnpm Workspace Configuration', () => {
  it('should have pnpm-workspace.yaml configuration', () => {
    const workspaceFile = join(process.cwd(), 'pnpm-workspace.yaml')
    expect(existsSync(workspaceFile)).toBe(true)
    
    const content = readFileSync(workspaceFile, 'utf8')
    expect(content).toContain('apps/*')
    expect(content).toContain('packages/*')
  })

  it('should have apps directory with packages', () => {
    const appsDir = join(process.cwd(), 'apps')
    expect(existsSync(appsDir)).toBe(true)
    
    const webDir = join(appsDir, 'web')
    expect(existsSync(webDir)).toBe(true)
  })

  it('should have packages directory with core packages', () => {
    const packagesDir = join(process.cwd(), 'packages')
    expect(existsSync(packagesDir)).toBe(true)
    
    const expectedPackages = ['contracts', 'api', 'auth', 'database', 'shared']
    expectedPackages.forEach(pkg => {
      const packageDir = join(packagesDir, pkg)
      expect(existsSync(packageDir)).toBe(true)
    })
  })

  it('should have root package.json with workspace configuration', () => {
    const packageFile = join(process.cwd(), 'package.json')
    expect(existsSync(packageFile)).toBe(true)
    
    const packageJson = JSON.parse(readFileSync(packageFile, 'utf8'))
    expect(packageJson.workspaces).toBeDefined()
    expect(packageJson.workspaces).toContain('apps/*')
    expect(packageJson.workspaces).toContain('packages/*')
  })

  it('should support workspace protocol linking', () => {
    // Test that workspace packages can use workspace: protocol
    const webPackageFile = join(process.cwd(), 'apps', 'web', 'package.json')
    if (existsSync(webPackageFile)) {
      const packageJson = JSON.parse(readFileSync(webPackageFile, 'utf8'))
      // Check if any dependencies use workspace protocol
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      }
      // If workspace deps exist, they should use workspace: protocol
      const workspaceDeps = Object.entries(allDeps).filter(([name]) => name.startsWith('@phoenix/'))
      workspaceDeps.forEach(([, version]) => {
        expect(version).toMatch(/^workspace:/)
      })
    }
  })
})