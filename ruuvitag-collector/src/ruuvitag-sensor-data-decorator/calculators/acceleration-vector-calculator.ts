/**
 * Calculates the acceleration vectors length.
 *
 * @return Returns the vector length as a number
 */
export const calculateAccelerationVectorLength = (
    accelerationX: number,
    accelerationY: number,
    accelerationZ: number,
): number => {
    const gravityValue = 0.981;
    const accelerationVectorLength = Math.sqrt(
        Math.pow(accelerationX, 2) + Math.pow(accelerationY, 2) + Math.pow(accelerationZ - gravityValue, 2)
    );
    return parseFloat(accelerationVectorLength.toFixed(1));
};
