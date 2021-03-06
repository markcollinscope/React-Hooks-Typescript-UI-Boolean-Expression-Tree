// Abstraction of the concept of a boolean expression.
// Deals with creation and calcution of such expressions, including constants values (T, F and U), 
// binary operations, unary operations (well NOT_OP only at the moment), and boolean logic extended to 
// undefined values.

/*
	Here's the grammar the Exp inheritance tree conforms to (or enables) below... (BNF format-ish):

	Exp ::= Exp | ConstExp | BinExp | NotExp
	// UniExp - no other unary operators except Not, so no point...
	
	NotExp ::= 'Not' Exp 

	BinExp ::= binOp Exp Exp
	binOp ::= 'And' | 'Or' | 'Xor' | 'Nand' | 'Nor'

	ConstExp ::= trueExp | falseExp | undefExp

	// implented as immutable constants in code.
	undefExp ::= 'Undefined'
	trueExp ::= 'True'
	falseExp ::= 'False'

	Key:-
	'inQuotes' means the string in question can be found in the code.
	lowerCase first letter on a name means there is not a class for this in the impl - it's just for grammar expansion.
	UpperCase means there's a class for it in the impl.

	nb: no UI related stuff here.
*/

//******
type uBoolean = true | false | undefined;

const uNot = (v: uBoolean) => (v === undefined) ? undefined : !v;
const uAnd = (l: uBoolean, r: uBoolean) => containsUndefined(l, r) ? undefined : l && r;
const uOr = (l: uBoolean, r: uBoolean) => containsUndefined(l, r) ? undefined : l || r;

//******
// abstract base class.
export abstract class Exp  
{
	abstract name() : 	string;
	abstract expand(): 	string;
	abstract calc():	uBoolean;
}

//******
class ConstExp extends Exp
{
	static nameString(v: uBoolean): string
	{
		if (v === true) return 'True';
		if (v === false) return 'False';
		return 'Undefined';
	}

	constructor(private value: uBoolean) { super(); }
	calc = () => this.value;
	name = () => ConstExp.nameString(this.value);
	expand = () => this.name();
}

export const UNDEF_EXP = 	new ConstExp(undefined);
export const TRUE_EXP = 	new ConstExp(true);
export const FALSE_EXP = 	new ConstExp(false);

export const UNDEF = UNDEF_EXP.name();
export const TRUE = TRUE_EXP.name();
export const FALSE = FALSE_EXP.name();

const containsUndefined = (l: uBoolean, r: uBoolean) => (l === undefined) || (r === undefined);

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

	name = () => 'Not';
	calc = (): uBoolean => uNot( this.getSubExp().calc() );
	expand = () => this.name() + LB + this.getSubExp().expand() + RB;
}
export const NOT_OP = (new NotExp()).name();

//******
// exported for tests (only). for formatting expressions.
export const LB = ' ( ';
export const RB = ' ) ';
export const SEPERATOR = ' , ';

export abstract class BinExp extends Exp
{
	constructor(private lhs: Exp = UNDEF_EXP, private rhs: Exp = UNDEF_EXP) { super(); }
	setLhsExp = (e: Exp) => this.lhs =  e;
	setRhsExp = (e: Exp) => this.rhs =  e;
	getLhsExp = () => this.lhs
	getRhsExp = () => this.rhs
	expand = () => this.name() + LB + this.getLhsExp().expand() + SEPERATOR + this.getRhsExp().expand() + RB;
}

export class AndExp extends BinExp
{
	name = () => 'And';
	calc = () => uAnd( this.getLhsExp().calc(), this.getRhsExp().calc() )
}
export const AND_OP = (new AndExp()).name();

export class OrExp extends BinExp
{
	name = () => 'Or';
	calc = () => uOr(this.getLhsExp().calc(), this.getRhsExp().calc())
}
export const OR_OP = (new OrExp()).name();

export class NandExp extends BinExp
{
	name = () => 'Nand';
	calc = () => uNot( uAnd(this.getLhsExp().calc(), this.getRhsExp().calc()) );
}
export const NAND_OP = (new NandExp()).name();

export class NorExp extends BinExp {
	name = () => 'Nor';
	calc = () => uNot( uOr(this.getLhsExp().calc(), this.getRhsExp().calc()) )
}
export const NOR_OP = (new NorExp()).name();

export class XorExp extends BinExp 
{
	name = () => 'Xor';
	calc = () => uOr(
		uAnd( this.getLhsExp().calc(), uNot(this.getRhsExp().calc()) ),
		uAnd( uNot(this.getLhsExp().calc()), this.getRhsExp().calc() )
	);
}
export const XOR_OP = (new XorExp()).name();

export const uBoolToName = (v: uBoolean) => v === undefined ? UNDEF : (v ? TRUE : FALSE);