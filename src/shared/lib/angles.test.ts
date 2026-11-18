import type { Degrees, Radians } from '../types'

import { describe, expect, expectTypeOf, it } from 'vitest'

import { angleOf, deg, degrees, degToRad, rad, radToDeg } from './angles'


describe('единицы углов', () => {
	it('различает градусы и радианы в типах', () => {
		expectTypeOf<Degrees>().not.toEqualTypeOf<Radians>()
		expectTypeOf<number>().not.toExtend<Degrees>()
		expectTypeOf<Radians>().not.toExtend<Degrees>()
		expectTypeOf<Parameters<typeof degToRad>[0]>().toEqualTypeOf<Degrees>()
		expectTypeOf<Parameters<typeof radToDeg>[0]>().toEqualTypeOf<Radians>()
		expectTypeOf(degrees.parse(90)).toEqualTypeOf<Degrees>()
	})

	it.each([0, 90, -180, 360])('конвертирует %s° туда и обратно', value => {
		expect(radToDeg(degToRad(deg(value)))).toBeCloseTo(value)
	})

	it('конвертирует единицы и возвращает направление в градусах', () => {
		expect(degToRad(deg(90))).toBeCloseTo(Math.PI / 2)
		expect(radToDeg(rad(-Math.PI / 4))).toBeCloseTo(-45)
		expect(angleOf(1, 0)).toBeCloseTo(90)
	})
})
