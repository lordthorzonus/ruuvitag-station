/**
 * Calculates the acceleration vector and its length
 *
 * @return Returns the vector length as a number
 */
export const calculateAccelerationVector = (
    accelerationX: number,
    accelerationY: number,
    accelerationZ: number
): number => {
    const gravityValue = 0.981;
    const accelerationVectLen = Math.sqrt(
        Math.pow(accelerationX, 2) + Math.pow(accelerationY, 2) + Math.pow(accelerationZ - gravityValue, 2)
    );
    return parseFloat(accelerationVectLen.toFixed(1));
};
