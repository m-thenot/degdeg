// This interface is incomplete
export interface PaymentMethod {
  id: string;
  livemode: boolean;
  customer: string;
  card: {
    exp_month: number;
    exp_year: number;
    last4: string;
    brand: string;
    fingerprint: string;
    country: string;
  };
}
