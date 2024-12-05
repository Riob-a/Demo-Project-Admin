import { useEffect } from 'react';
import WOW from 'wowjs';

export const useWow = () => {
  useEffect(() => {
    const wow = new WOW.WOW();
    wow.init();
  }, []);
};
