import { calculateAccelerationVectorLength } from './acceleration-vector-calculator';

describe('Acceleration calculator', () => {
    const testCases: Array<[number, number, number, number]> = [
        [1, 1, 1, 1.4],
        [3, 2.5, 4.2, 5.1],
        [4.3, 2.8, 5, 6.5],
        [36, 10, 37, 51.9],
    ];

    it.each(testCases)(
        'should calculate the acceleration vector length: accelerationX: %s, acceletarionY: %s, accelerationZ %s should produce a vector length of: %s',
        (accelerationX, acceletarionY, accelerationZ, expectedLength) => {
            expect(
                calculateAccelerationVectorLength(accelerationX, acceletarionY, accelerationZ),
            ).toEqual(expectedLength);
        },
    );
});
