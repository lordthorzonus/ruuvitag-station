/**
 * Calculates the acceleration vectors length.
 *
 * @return Returns the vector length as a number
 */
export const calculateAccelerationVectorLength = (
    accelerationX: number | null,
    accelerationY: number | null,
    accelerationZ: number | null,
): number | null => {

    if (accelerationX === null || accelerationY === null || accelerationZ === null) {
        return null;
    }

    const gravityValue = 0.981;
    const accelerationVectorLength = Math.sqrt(
        Math.pow(accelerationX, 2)
        + Math.pow(accelerationY, 2)
        + Math.pow(accelerationZ - gravityValue, 2),
    );
    return parseFloat(accelerationVectorLength.toFixed(1));
};
