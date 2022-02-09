// general purpose stuff.

import { AppError } from './AppError'

const DEBUG = false;
export const lg = (...args: any)  => { if (DEBUG) console.log(...args); };
export const assert = (v: boolean)  => { if (!v) throw new AppError('assertion error'); }
