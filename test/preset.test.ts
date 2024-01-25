import { expect, it } from 'vitest'
import { Config, defineConfig } from '../src'

it('should return config', () => {
    expect(defineConfig({})).toBeInstanceOf(Config)
})

it('should contains all resolvers', () => {
    expect(defineConfig({})['resolvers']).toHaveLength(4)
})

it('should not contains all resolvers', () => {
    expect(defineConfig({}, { argv: false, env: false, json: false, yaml: false })['resolvers']).toHaveLength(0)
})

it('should auto search config file', () => {
    expect(defineConfig({}, { search: { name: 'test' } })['resolvers']).toHaveLength(4)
    expect(defineConfig({}, { search: { name: 'test' }, json: false })['resolvers']).toHaveLength(3)
    expect(defineConfig({}, { search: { name: 'test' }, yaml: false })['resolvers']).toHaveLength(3)
})
