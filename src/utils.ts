// general purpose stuff.


class AppError extends Error {};

const DEBUG = false;
export const lg = (...args: any)  => { if (DEBUG) console.log(...args); };
export const assert = (v: boolean)  => { if (!v) throw new AppError('assertion error'); }
export const progError = () => { throw new AppError('programming error - back to the drawing board'); }

