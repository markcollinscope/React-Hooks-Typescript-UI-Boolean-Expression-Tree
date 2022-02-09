// Abstraction of the concept of a boolean expression.
// Deals with creation and calcution of such expressions, including constants values, 
// binary operations, unary operations (well NOT_OP), and undefined values.

// The code here does Not deal with UI - this code is 'functional' (business) logic only.
// It is used by the UI code to create, modify and evaluate the expressions contained herein.

import { AppError } from './AppError';
import { progError } from './utils';

//******
// this belongs here as it is integrally bound into how this module works.
export class UndefExpError extends AppError
{
	constructor(message: string = "cannot calcuate expression") { super(message); }
}

//******
export class Exp  // abstract base class.
{
	name = (): string | never => progError();
	expand = (): string | never => progError();
	calc = (): boolean | never => progError();
}

//******
class UndefExp extends Exp // no export - immutable Undef Exp value created and exported.
{
	name = () => 'Undefined';
	expand = () => this.name();
	calc = (): boolean | never => 
	{ 
		// throwing exception saves hassle dealing with UNDEF left, right and centre during bool op evaluation.
		throw new UndefExpError(); 
	} 
}
export const UNDEF_EXP = new UndefExp();
export const UNDEF = UNDEF_EXP.name();
const throwIfUndefined = (arrExp: Exp[]) => arrExp.forEach( (v) => { if (v === UNDEF_EXP) throw new UndefExpError(); });

//******
class ConstExp extends Exp // no export - T, F immutable Exp values created and exported.
{
	constructor(private value: boolean)
	{
		super();
	}

	calc = () => this.value;
	name = () => this.value ? 'True' : 'False';
	expand = () => this.name();
}
export const TRUE_EXP = new ConstExp(true);
export const FALSE_EXP = new ConstExp(false);
export const TRUE = TRUE_EXP.name();
export const FALSE = FALSE_EXP.name();

//******
export class NotExp extends Exp
{
	constructor(private subExp: Exp = UNDEF_EXP)
	{
		super()
		this.setSubExp(subExp)
	}

	getSubExp = () => this.subExp
	setSubExp = (e: Exp) => this.subExp = e;
	
	calc = (): boolean => ! this.getSubExp().calc();
	name = () => 'Not';
	expand = () => this.name() + LB + this.getSubExp().expand() + RB;
}
export const NOT_OP = (new NotExp()).name();

//******
const LHS = '_LHS_'
const RHS = '_RHS_'

// for formatting of expressions when converting to string version of the expression.
// exported for tests (only).
export const LB = ' ( ';
export const RB = ' ) ';
export const SEPERATOR = ' , ';

// create BinExp with AND_OP or OR_OP op.
export const AND_OP = 	'And';
export const OR_OP = 	'Or';
export class BinExp extends Exp
{
	private subexp: { [index: string] : Exp } = {};

	// extensible approach - add 'NAND_OP' - just follow the pattern!
	private static calcFn: { [index: string]: ( (l: Exp, r: Exp) => boolean ) } =
	{
		[AND_OP]: (l: Exp, r: Exp) => l.calc() && r.calc(),
		[OR_OP]:  (l: Exp, r: Exp) => l.calc() || r.calc()
	}

	// lhs/rhs - left/right hand side (of subexpression), etc.
	// op - a binary operator on booleans (and, or, xor, nor ...)
	constructor(private op: string, lhs = UNDEF_EXP, rhs = UNDEF_EXP)
	{
		super();
		this.setLhsExp(lhs);
		this.setRhsExp(rhs);
	}

	setLhsExp = (e: Exp) => this.subexp[LHS] =  e;
	setRhsExp = (e: Exp) => this.subexp[RHS] =  e;
	getLhsExp = () => this.subexp[LHS];
	getRhsExp = () => this.subexp[RHS];

	name = () => this.op;
	expand = () => this.name() + LB + this.getLhsExp().expand() + SEPERATOR + this.getRhsExp().expand() + RB;
	calc = () => 
	{ 
		const l = this.getLhsExp(), r = this.getRhsExp(); 
		throwIfUndefined([l, r]); 

		return BinExp.calcFn[this.op](l,r);
	}
}
