// whole dollars show without decimals, anything else shows two decimals
export const money = (amount: number) => `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
