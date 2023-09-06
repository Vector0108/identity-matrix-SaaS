import { loadStripe } from '@stripe/stripe-js';

let stripePromise:any;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '', {locale: 'en'});
  }
  return stripePromise;
};

export default getStripe;