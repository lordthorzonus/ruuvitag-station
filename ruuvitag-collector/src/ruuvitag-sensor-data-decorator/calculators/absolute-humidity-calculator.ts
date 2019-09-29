/**
 * Calculates the vapour pressure of the water where water vapour
 * is in thermodynamic equilibrium with its condensed state using Magnus-Tetens formula.
 * @see https://carnotcycle.wordpress.com/2012/08/04/how-to-convert-relative-humidity-to-absolute-humidity/
 * @see https://en.wikipedia.org/wiki/Vapour_pressure_of_water
 */
const calculateVapourPressureOfWater = (temperatureInCelsius: number): number => {
    return 6.112 * Math.exp(17.67 * temperatureInCelsius / (temperatureInCelsius + 243.5));
};

/**
 * Calculates the absolute humidity.
 *
 * @see https://carnotcycle.wordpress.com/2012/08/04/how-to-convert-relative-humidity-to-absolute-humidity/
 *
 * @return Returns the value in (grams/m^3)
 */
export const calculateAbsoluteHumidity = (
    temperatureInCelsius: number,
    relativeHumidityInPercents: number,
): number => {
    const molarMassOfWater = 18.01534;
    const universalGasConstant = 8.31447215;

    const absoluteHumidity = (
        calculateVapourPressureOfWater(temperatureInCelsius)
        * relativeHumidityInPercents
        * molarMassOfWater
    ) / (
        (273.15 + temperatureInCelsius) * universalGasConstant
    );

    return parseFloat(absoluteHumidity.toFixed(2));
};
