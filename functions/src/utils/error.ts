interface ApiError {
  code: number;
  message: string;
}

export const isApiError = (x: any): x is ApiError => {
  return typeof x.code === 'number';
};
