import { dirname } from '@kdt310722/utils/node'
import { z } from 'zod'
import { defineConfig } from '../src'

const schema = {
    a: z.string(),
    b: z.object({
        testKey: z.coerce.number(),
    }),
    json: z.boolean(),
    yml: z.boolean(),
}

const config = defineConfig(schema, {
    env: { unflatten: { delimiter: '__' }, prefix: 'CONFIG_' },
    yaml: { path: dirname(import.meta, 'config/test.yml') },
    search: {
        name: 'test',
        cwd: dirname(import.meta, 'config'),
    },
})

// eslint-disable-next-line no-console
console.log(config.resolve())

// eslint-disable-next-line no-console
console.log(config.parse())
