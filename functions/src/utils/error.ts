interface ApiError {
  code: number;
  message: string;
}

export const isApiError = (x: any): x is ApiError => {
  return typeof x.code === 'number';
};

interface StripeError {
  code: string;
  message: string;
  raw: any;
}

export const isStripeError = (x: any): x is StripeError => {
  return typeof x.code === 'string';
};
