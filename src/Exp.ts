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

export const LB = '(';
export const RB = ')';
export const SEPERATOR = ',';

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
	sub = (op: string): Exp | never => { throw new AppError(); }
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
class CompoundExp extends Exp 
{
	private subexp: { [index: string] : Exp } = {};
	
	sub = (op: string) => this.subexp[op];
	setsub 	= (op: string, v: Exp) => this.subexp[op] = v;
}

export const UNI = 'UNI'; // todo: rename. deprecate, use NOT
export const NOT = 'NOT';
export class NotExp extends CompoundExp
{
	constructor(subExp: Exp = undefExp)
	{
		super()
		this.setsub(NOT, subExp)
	}

	calc = (): boolean => ! this.sub(NOT).calc();
	name = (): string => NOT
	expand = () => this.name() + LB + this.sub(NOT).expand() + RB;
}

export const LHS = 'LHS'
export const RHS = 'RHS'
export const AND = 'AND';
export const OR = 'OR';
export class BinExp extends CompoundExp
{
	static calcFn: { [index: string]: (lh: Exp, rh: Exp) => boolean} = // extensible approach - add 'NAND' - just follow the pattern!
	{
		AND: (lh: Exp, rh: Exp) => lh.calc() && rh.calc(),
		OR:  (lh: Exp, rh: Exp) => lh.calc() || rh.calc()
	}

	constructor(private op: string, lhs = undefExp, rhs = undefExp)
	{
		super();
		this.setsub(LHS,lhs);
		this.setsub(RHS, rhs);
	}

	name = () => this.op;
	calc = () => BinExp.calcFn[this.op]( this.sub(LHS), this.sub(RHS) );
	expand = () => this.name() + LB + this.sub(LHS).expand() + SEPERATOR + this.sub(RHS).expand() + RB;
}

// TODO: check out exception capture by type!
