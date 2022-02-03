/*
Ui Actions:
* Eval Button - enabled when Eval possible.
* Txt representation of expression shown.
* Start: undef-nodetype -> UI Select From Drop Down Menu -> Create Appropriate Subnode. Factory.
* AND, OR, BINOP => two undef subnodes.
* NOT => one undef subnode.
* Eval => recursive descent evaluation.
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
// Deals with creation and evalution of such expressions, including constants values, binary operations unary operations.
// This module does not deal with UI as it is part of the business logic of the application.
// It is, of course, used by the UI code to create, modify and evaluate the expressions contained herein.

const ERROR = 'error';

export const APP_ERROR = Symbol(ERROR);	// every calls to Symbol(ERROR) is guaranteed to return a UNIQUE symbol.
class AppError
{
	private errCode = APP_ERROR;

	constructor(code: number = AppError.APP_ERROR, message: string = "basic application programming error")
	{
		this.errCode = code;
		this.message = message
	}
	code = () => this.errCode;
	msg = () => this.message;
}-

export const NO_EVAL_ERROR = Symbol(ERROR);
class NoEvalError extends AppError
{
	constructor(message: string = "cannot evaluate expression")
	{
		super(NO_EVAL_ERROR, message);
	}
}

class Exp  
{
	name = (): string | never => throw new AppError();
	eval = (): number | never => throw new AppError();
}

class UndefExp extends Exp
{
	name = (): string => return 'Undef';
	eval = (): boolean | never => { throw NoEvalError(); } 
}

class ConstExp extends Exp
{
	private value = undefined;

	contructor(value: boolean)
	{
		this.value = value; // T, F or Undef.
	}

	eval = () => this.value;
	name = () => this.value ? 'true' : 'false';
}

Type UniOpType = 'NOT | SAME'
const UniOpExp extends Exp
{
	private subType: UniOpType = undefined;
	private subExp: Exp = undefined; // ???
}


