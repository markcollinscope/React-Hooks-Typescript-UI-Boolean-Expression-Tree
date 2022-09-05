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

import {  uBoolean, uNot, uAnd, uOr, uBoolToName } from './ubool';

// backwards compatibility after file restructure.
export {  uNot, uAnd, uOr, TRUE, FALSE, UNDEF, uBoolToName } from './ubool';

//******
export abstract class Exp
{
	constructor(private op: string) {};	// save operator type
	name = () => this.op;				// what is the name of the Exp's operator. Concrete impl, all Exp types.
	abstract expand(): 	string;				// return a string expansion of the Exp.
	abstract calc():	uBoolean;			// calculate the value of the Exp.
}

//******
class ConstExp extends Exp	// nb: not exported. Only pre-defined constants are exported.
{
	constructor(private value: uBoolean) { super( uBoolToName(value) ); }
	calc = () => this.value;
	expand = () => this.name();
}

/* standard constant expression values - exported */
export const UNDEF_EXP = 	new ConstExp(undefined);
export const TRUE_EXP = 	new ConstExp(true);
export const FALSE_EXP = 	new ConstExp(false);

const DEFAULT_EXP = UNDEF_EXP;	// default parameter/argument value - not absolutely necessary.

export const LB = ' ( ';
export const RB = ' ) ';
export const SEPERATOR = ' , ';

export abstract class UniExp extends Exp
{
	constructor(private operatorValue: string, private subExp: Exp)
	{
		super(operatorValue);
		this.setSubExp(subExp);
	}

	/*  Std Exp Ops */
	expand = () => this.name() + LB + this.getSubExp().expand() + RB;
	
	/* Unary Exp Specific Ops */
	getSubExp = () => this.subExp
	setSubExp = (e: Exp) => this.subExp = e;
}

export abstract class BinExp extends Exp
{
	constructor(operator: string, private lhs: Exp, private rhs: Exp) 
	{ 
		super(operator); 
	}

	/* Std Exp Ops - nb: No calc() as don't know how to calc() in abstract BinExp type  */
	expand = () => this.name() + LB + this.getLhsExp().expand() + SEPERATOR + this.getRhsExp().expand() + RB;
	
	/* BinExp only ops - i.e. only make sense for binary operators / expression nodes */
	// simple setters/getters - nb: these are implementations that all binary expressions will share.
	// here binary expression means any class derived from (extend-ing) BinExp
	setLhsExp = (e: Exp) => this.lhs =  e;
	setRhsExp = (e: Exp) => this.rhs =  e;
	getLhsExp = () => this.lhs;
	getRhsExp = () => this.rhs;
}

export const NOT_OP = 'Not' as string;
export class NotExp extends UniExp
{
	constructor(subExp: Exp = DEFAULT_EXP) { super(NOT_OP, subExp); }
	calc = (): uBoolean => uNot( this.getSubExp().calc() );
}

export const AND_OP = 'And' as string;
export class AndExp extends BinExp
{
	constructor(lhs: Exp = DEFAULT_EXP, rhs: Exp = DEFAULT_EXP) { super (AND_OP, lhs, rhs); }
	calc = () => uAnd( this.getLhsExp().calc(), this.getRhsExp().calc() )
}

export const OR_OP = 'Or' as string
export class OrExp extends BinExp
{
	constructor(lhs: Exp = DEFAULT_EXP, rhs: Exp = DEFAULT_EXP) { super (OR_OP, lhs, rhs); }
	calc = () => uOr(this.getLhsExp().calc(), this.getRhsExp().calc())
}

export const NAND_OP = 'Nand' as string;
export class NandExp extends BinExp
{
	constructor(lhs: Exp = DEFAULT_EXP, rhs: Exp = DEFAULT_EXP) { super (NAND_OP, lhs, rhs); }
	calc = () => uNot( uAnd(this.getLhsExp().calc(), this.getRhsExp().calc()) );
}

export const NOR_OP = 'Nor' as string;
export class NorExp extends BinExp
{
	constructor(lhs: Exp = DEFAULT_EXP, rhs: Exp = DEFAULT_EXP) { super (NOR_OP, lhs, rhs); }
	calc = () => uNot( uOr(this.getLhsExp().calc(), this.getRhsExp().calc()) )
}

export const XOR_OP = 'Xor' as string;
export class XorExp extends BinExp 
{
	constructor(lhs: Exp = DEFAULT_EXP, rhs: Exp = DEFAULT_EXP) { super (XOR_OP, lhs, rhs); }
	calc = () => uOr(
 		uAnd( this.getLhsExp().calc(), uNot(this.getRhsExp().calc()) ),
		uAnd( uNot(this.getLhsExp().calc()), this.getRhsExp().calc() )
	);
}