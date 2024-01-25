import type { ZodType } from 'zod'
import type { Primitive, PrimitiveArray, PrimitiveMap, PrimitiveObject, PrimitiveSet } from './types'

export type ConfigSchemaValue = Primitive | PrimitiveArray | PrimitiveSet | PrimitiveMap | PrimitiveObject

export type ConfigSchema = Record<string, ZodType<ConfigSchemaValue>>
