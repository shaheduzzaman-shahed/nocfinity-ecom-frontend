export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencySettings {
  currency: string;
  supported_currencies: SupportedCurrency[];
}

export interface UpdateCurrencyPayload {
  currency: string;
}
