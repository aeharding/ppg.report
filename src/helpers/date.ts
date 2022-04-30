import { isWithinInterval as _isWithinInterval } from "date-fns";

export const isWithinInterval: typeof _isWithinInterval = (...args) => {
  try {
    return _isWithinInterval(...args);
  } catch (e) {
    if (e instanceof RangeError) return false;

    throw e;
  }
};
