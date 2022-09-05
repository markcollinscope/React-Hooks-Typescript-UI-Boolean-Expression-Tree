//  Extend the basic behaviour of the application without changing any core source code.

import { Exp, BinExp, DEFAULT_EXP } from './Exp';
import { displayBinExp, extendExpFactory } from './ExpView';

// Example: EQ operator True IFF  a EQ b - i.e. same value.

export const EQ_OP = '==' as string;
export class EqExp extends BinExp 
{
	constructor(lhs: Exp = DEFAULT_EXP, rhs: Exp = DEFAULT_EXP) { super (EQ_OP, lhs, rhs); }
	calc = () => this.getLhsExp().calc() === this.getRhsExp().calc();
}

const  eqExtension = { exp: () => new EqExp(), display: displayBinExp }

export function eqExtensionFn()
{
    extendExpFactory(EQ_OP, eqExtension);
}
