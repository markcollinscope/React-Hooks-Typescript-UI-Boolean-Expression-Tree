// Abstraction of the concept of a boolean expression.
// Deals with creation and calcution of such expressions, including constants values (T, F), 
// binary operations, unary operations (well NOT_OP only at the moment), and undefined values.

/*
	Here's the grammar the Exp inheritance tree conforms to (or enables) below... (BNF format-ish):

	Exp ::= Exp | ConstExp | BinExp | NotExp
	
	// UniExp - no other unary operators except Not, so no point...
	
	NotExp :== 'Not' Exp 

	BinExp :== binOp Exp Exp
	binOp ::= 'And' | 'Or' | 'Xor' | 'Nand' | 'Nor'

	ConstExp ::= trueExp | falseExp | undefExp
	undefExp ::= 'Undefined'
	trueExp ::= 'True'
	falseExp ::= 'False'

	'inQuotes' means there is a class that will contain that value explicitly in the implementation.
	lowerCase means there is not class for this - it's just for grammar expansion.
	UpperCase means there's a class that does this!
	*/

// The code here does Not deal with UI - this code is 'functional' (business) logic only.
// It is used by the UI code to create, modify and evaluate the expressions contained herein.

import { progError } from './utils';

//******
// extended boolean class - includes 'undefined'
type xtdboolean = true | false | undefined;

// abstract base class - which Typescript doesn't support directly, hence the progError stuff...
// methods/functions are effectively placeholders for subclasses.

export class Exp  
{
	name = (): string | never => progError();
	expand = (): string | never => progError();
	calc = (): xtdboolean | never => progError();
}

//******
class ConstExp extends Exp // no export - T, F immutable Exp values created and exported.
{
	static nameString(v: xtdboolean): string
	{
		if (v === true) return 'True';
		if (v === false) return 'False';
		return 'Undefined';
	}

	constructor(private value: xtdboolean) { super(); }
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

const containsUndefined = (l: xtdboolean, r: xtdboolean) => (l === undefined) || (r = undefined);

// 'extended' (xtdboolean) - operators. can handle undefined values.
const xtdnot = (v: xtdboolean) => (v === undefined) ? undefined : ! v;
const xtdand = (l: xtdboolean, r: xtdboolean): xtdboolean => containsUndefined (l, r) ? undefined : l && r;
const xtdor = (l: xtdboolean, r: xtdboolean): xtdboolean => containsUndefined(l, r) ? undefined : l || r;

// discussion: arguably there could be a UniExp type (unary expressions - one arg, one operator).
// however as it stands, doesn't seem worth it. what other unary expressions could there be :-) - an identity op?
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
	calc = (): xtdboolean => xtdnot( this.getSubExp().calc() );
	expand = () => this.name() + LB + this.getSubExp().expand() + RB;
}
export const NOT_OP = (new NotExp()).name();

//******
// for formatting of expressions when converting to expanded (string) visual representation.
// exported for tests (only).
export const LB = ' ( ';
export const RB = ' ) ';
export const SEPERATOR = ' , ';

export class BinExp extends Exp
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
	calc = () => xtdand( this.getLhsExp().calc(), this.getRhsExp().calc() )
}
export const AND_OP = (new AndExp()).name();

export class OrExp extends BinExp
{
	name = () => 'Or';
	calc = () => xtdor(this.getLhsExp().calc(), this.getRhsExp().calc())
}
export const OR_OP = (new OrExp()).name();

export class NandExp extends BinExp
{
	name = () => 'Nand';
	calc = () => xtdnot( xtdand(this.getLhsExp().calc(), this.getRhsExp().calc()) );
}
export const NAND_OP = (new NandExp()).name();

export class NorExp extends BinExp {
	name = () => 'Nor';
	calc = () => xtdnot( xtdor(this.getLhsExp().calc(), this.getRhsExp().calc()) )
}
export const NOR_OP = (new NorExp()).name();

export class XorExp extends BinExp 
{
	name = () => 'Xor';
	calc = () => xtdor(
		xtdand( this.getLhsExp().calc(), xtdnot(this.getRhsExp().calc()) ),
		xtdand( xtdnot(this.getLhsExp().calc()), this.getRhsExp().calc() )
	);
}
export const XOR_OP = (new XorExp()).name();

