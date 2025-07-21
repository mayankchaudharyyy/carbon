export const CARBON_FACTORS = {
  transport: {
    car_gasoline: 0.251,
    car_diesel: 0.217,
    car_electric: 0.051,
    bus: 0.089,
    train: 0.041,
    airplane: 0.255,
    motorcycle: 0.113,
    bike: 0,
    walking: 0
  },
  electricity: {
    kwh: 0.5,
    natural_gas: 0.185,
    renewable: 0.05
  },
  food: {
    beef: 27.0,
    pork: 12.1,
    chicken: 6.9,
    fish: 6.1,
    dairy: 3.2,
    vegetables: 2.0,
    fruits: 1.1,
    grains: 1.4
  },
  waste: {
    landfill: 0.5,
    recycling: 0.1,
    composting: 0.05
  },
  home: {
    heating_gas: 0.185,
    cooling_electric: 0.5,
    water_heating: 0.3
  }
};

export function calculateCarbonFootprint(
  category: string,
  subcategory: string,
  amount: number
): number {
  const categoryFactors = CARBON_FACTORS[category as keyof typeof CARBON_FACTORS];
  if (!categoryFactors) return 0;

  const factor = categoryFactors[subcategory as keyof typeof categoryFactors];
  if (typeof factor !== 'number') return 0;

  return amount * factor;
}

export function getCarbonFactorInfo(category: string, subcategory: string) {
  const categoryFactors = CARBON_FACTORS[category as keyof typeof CARBON_FACTORS];
  if (!categoryFactors) return null;

  const factor = categoryFactors[subcategory as keyof typeof categoryFactors];
  if (typeof factor !== 'number') return null;

  return {
    factor,
    unit: getUnitForCategory(category, subcategory)
  };
}

function getUnitForCategory(category: string, subcategory: string): string {
  if (category === 'transport') return 'km';
  if (category === 'electricity') return 'kWh';
  if (category === 'food') return 'kg';
  if (category === 'waste') return 'kg';
  if (category === 'home') return 'kWh';
  return 'unit';
}

export function getRecommendedUnit(category: string, subcategory: string): string {
  return getUnitForCategory(category, subcategory);
}