// general purpose stuff.

export const lg = (...args: any)  => console.log(...args);
export const assert = (v: boolean)  => { if (!v) throw new Error('assertion error'); }
