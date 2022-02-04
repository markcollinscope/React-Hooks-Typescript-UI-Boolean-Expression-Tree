/*
Ui Actions:
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
// Deals with creation and calcution of such expressions, including constants values, binary operations unary operations.
// This module does not deal with UI as it is part of the business logic of the application.
// It is, of course, used by the UI code to create, modify and calcuate the expressions contained herein.

// ease change of formatting
export const LB = '(';
export const RB = ')';
export const DIV = ',';
export const TRUE = 'TRUE';
export const FALSE = 'FALSE';
export const UNDEF = 'UNDEF';
export const NOT = 'NOT';

export const APP_ERROR = Symbol('app-error');	// every calls to Symbol(value) is guaranteed to return a UNIQUE symbol, even if value is
export class AppError
{
	private errCode: symbol;
	private message: string;

	constructor(code: symbol = APP_ERROR, message: string = "basic application programming error")
	{
		this.errCode = code;
		this.message = message
	}
	code = () => this.errCode;
	msg = () => this.message;
}

export const NO_EVAL_ERROR = Symbol('no-calc-error');
export class NoEvalError extends AppError
{
	constructor(message: string = "cannot calcuate expression")
	{
		super(NO_EVAL_ERROR, message);
	}
}

export class Exp  
{
	name = (): string | never => { throw new AppError(); }
	expand = (): string | never => { throw new AppError(); }
	calc = (): boolean | never => { throw new AppError(); } // TODO check never;
}

export class UndefExp extends Exp
{
	name = (): string => UNDEF;
	expand = () => this.name();
	calc = (): boolean | never => { throw new NoEvalError(); } 
}

export const undefExp = new UndefExp();

export class ConstExp extends Exp
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

export class NotExp extends Exp
{
	constructor(private subExp: Exp = undefExp)
	{
		super()
	}

	calc = (): boolean => ! this.subExp.calc();
	name = (): string => NOT
	expand = () => this.name() + LB + this.subExp.expand() + RB;
}

export const AND = 'AND';
export const OR = 'OR';
export type BinOpType = typeof AND | typeof OR ;

export class BinExp extends Exp
{
	static calcFn =
	{
		AND: (lh: Exp, rh: Exp) => lh.calc() && rh.calc(),
		OR:  (lh: Exp, rh: Exp) => lh.calc() || rh.calc()
	}
	constructor(private op: BinOpType, private lhs = undefExp, private rhs = undefExp)
	{
		super();
	}
	name = () => this.op;
	calc = () => BinExp.calcFn[this.op]( this.lhs, this.rhs );
	expand = () => this.name() + LB + this.lhs.expand() + DIV + this.rhs.expand() + RB;
}

