import { calculateAccelerationVectorLength } from './acceleration-vector-calculator';

describe('Acceleration calculator', () => {
    const testCases: Array<[number | null, number | null, number | null, number | null]> = [
        [1, 1, 1, 1.4],
        [3, 2.5, 4.2, 5.1],
        [4.3, 2.8, 5, 6.5],
        [36, 10, 37, 51.9],
        [null, 10, 37, null],
        [36, null, 37, null],
        [36, 10, null, null],
        [null, 10, null, null],
        [36, null, null, null],
        [null, null, null, null],
    ];

    it.each(testCases)(
        'should calculate the acceleration vector length: accelerationX: %s, acceletarionY: %s, accelerationZ %s should produce a vector length of: %s',
        (accelerationX, accelerationY, accelerationZ, expectedLength) => {
            expect(
                calculateAccelerationVectorLength(accelerationX, accelerationY, accelerationZ),
            ).toEqual(expectedLength);
        },
    );
});
