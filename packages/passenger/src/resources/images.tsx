// CREDIT CARDS ICONS

import React from 'react';
import AmexIcon from '@assets/images/amex.svg';
import VisaIcon from '@assets/images/visa.svg';
import MasterCardIcon from '@assets/images/mastercard.svg';
import UnionPayIcon from '@assets/images/union_pay.svg';
import CreditCardIcon from '@assets/images/credit_card.svg';

export const CREDIT_CARDS = {
  amex: <AmexIcon width={50} height={50} />,
  jcb: <CreditCardIcon width={50} height={35} />,
  mastercard: <MasterCardIcon width={50} height={18} />,
  visa: <VisaIcon width={50} height={18} />,
  unionpay: <UnionPayIcon width={50} height={35} />,
  unknown: <CreditCardIcon width={50} height={35} />,
  discover: <CreditCardIcon width={50} height={35} />,
  dinersclub: <CreditCardIcon width={50} height={35} />,
};
