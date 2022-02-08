/*
UI Actions:
* Eval Button - enabled when Eval possible.
* Txt representation of expression shown.
* Start: undef-nodetype -> UI Select From Drop Down Menu -> Create Appropriate Subnode. Factory.
* AND, OR, BINOP => two undef subnodes.
* NOT => one undef subnode.
* Eval => recursive descent calcuation.
* Undef in Eval (anywhere) - whole expression is Undef.

Menu:
* On Undef nodes only.
* Callback deletes then recreates lhs, rhs ...

Delete:
* On Composite Nodes (UI) only.
* Replaces subnode with Undef.
* ... then: just normal.
*/

// Abstraction of the concept of a valid boolean expression.
// Deals with creation and calcution of such expressions, including constants values, binary operations, unary operations.
// This module does not deal with UI as it is part of the business logic of the application.
// It is, of course, used by the UI code to create, modify and calcuate the expressions contained herein.

// for ease in change of formatting - add extra spaces ... etc.
import { lg } from './utils';

export const LB = ' ( ';
export const RB = ' ) ';
export const SEPERATOR = ' , ';

export class AppError extends Error
{
	constructor(message: string = "basic application programming error") 
	{
		super(message);
	}
}

export class NoEvalError extends AppError
{
	constructor(message: string = "cannot calcuate expression")
	{
		super(message);
	}
}

export class Exp  
{
	name = (): string | never => { throw new AppError(); }
	expand = (): string | never => { throw new AppError(); }
	calc = (): boolean | never => { throw new AppError(); } // TODO check never;
}

export const UNDEF = 'UNDEF';
class UndefExp extends Exp // no export - immutable Undef Exp value created and exported.
{
	name = () => UNDEF;
	expand = () => this.name();
	calc = (): boolean | never => 
	{ 
		// throwing exception saves hassle dealing with UNDEF left, right and centre during bool op evaluation.
		throw new NoEvalError(); 
	} 
}
export const undefExp = new UndefExp(); // todo: rename

export const TRUE = 'TRUE';
export const FALSE = 'FALSE';
class ConstExp extends Exp // no export - T, F immutable Exp values created and exported.
{
	constructor(private value: boolean)
	{
		super();
	}

	calc = () => this.value;
	name = () => this.value ? TRUE : FALSE;
	expand = () => this.name();
}
export const trueExp = new ConstExp(true);
export const falseExp = new ConstExp(false);

// no export - Binary (AND,OR) and NOT Exp classes exported.
/*
class CompoundExp extends Exp // Deprecate?
{
	private subexp: { [index: string] : Exp } = {};
	
	sub = (op: string) => this.subexp[op];
	setsub 	= (op: string, v: Exp) => this.subexp[op] = v;
}
*/

export const NOT = 'NOT';
export class NotExp extends Exp
{
	constructor(private subExp: Exp = undefExp)
	{
		super()
		this.setsubexp(subExp)
	}

	getsubexp = () => this.subExp
	setsubexp = (e: Exp) => this.subExp = e;
	
	calc = (): boolean => ! this.getsubexp().calc();
	name = (): string => NOT
	expand = () => this.name() + LB + this.getsubexp().expand() + RB;
}

export const LHS = 	'LHS'
export const RHS = 	'RHS'
export const AND = 	'AND';
export const OR = 	'OR';
export class BinExp extends Exp
{
	private subexp: { [index: string] : Exp } = {};

	// extensible approach - add 'NAND' - just follow the pattern!
	static calcFn: { [index: string]: (lh: Exp, rh: Exp) => boolean } =
	{
		AND: (lh: Exp, rh: Exp) => lh.calc() && rh.calc(),
		OR:  (lh: Exp, rh: Exp) => lh.calc() || rh.calc()
	}

	// lhs/rhs - left/right hand side (of subexpression), etc.
	// op - a binary operator on booleans (and ...)
	constructor(private op: string, lhs = undefExp, rhs = undefExp)
	{
		super();
		this.setlhsexp(lhs);
		this.setrhsexp(rhs);
	}

	setlhsexp = (e: Exp) => this.subexp[LHS] =  e;
	setrhsexp = (e: Exp) => this.subexp[RHS] =  e;
	getlhsexp = () => this.subexp[LHS];
	getrhsexp = () => this.subexp[RHS];

	name = () => this.op;
	calc = () => BinExp.calcFn[this.op]( this.getlhsexp(), this.getrhsexp() );
	expand = () => this.name() + LB + this.getlhsexp().expand() + SEPERATOR + this.getrhsexp().expand() + RB;
}

// TODO: check out exception capture by type!
// TODO: Rename AND -> AND_T ...
