/**
 * @phoenix/contracts
 * 
 * Type-safe API contracts and domain models for Phoenix platform.
 * This package provides the single source of truth for all API schemas,
 * domain types, and validation rules across the Phoenix ecosystem.
 */

// Export all API contracts
export * from './api/index.js'

// Export all domain models
export * from './domain/index.js'

// Export all schemas
export * from './schemas/index.js'

// Package version and metadata
export const CONTRACTS_VERSION = '0.0.1'
export const CONTRACTS_NAME = '@phoenix/contracts'