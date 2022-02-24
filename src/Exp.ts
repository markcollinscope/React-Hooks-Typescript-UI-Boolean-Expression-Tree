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

	// implented as immutable constants in code.
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
type uboolean = true | false | undefined;

// abstract base class - which Typescript doesn't support directly, so progError()...
export class Exp  
{
	name = (): string | never => progError();
	expand = (): string | never => progError();
	calc = (): uboolean | never => progError();
}

//******
class ConstExp extends Exp // no export - T, F immutable Exp values created and exported.
{
	static nameString(v: uboolean): string
	{
		if (v === true) return 'True';
		if (v === false) return 'False';
		return 'Undefined';
	}

	constructor(private value: uboolean) { super(); }
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

const containsUndefined = (l: uboolean, r: uboolean) => (l === undefined) || (r = undefined);


const unot = (v: uboolean) => (v === undefined) ? undefined : ! v;
const uand = (l: uboolean, r: uboolean): uboolean => containsUndefined (l, r) ? undefined : l && r;
const uor = (l: uboolean, r: uboolean): uboolean => containsUndefined(l, r) ? undefined : l || r;

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
	calc = (): uboolean => unot( this.getSubExp().calc() );
	expand = () => this.name() + LB + this.getSubExp().expand() + RB;
}
export const NOT_OP = (new NotExp()).name();

//******
// exported for tests (only). for formatting expressions.
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
	calc = () => uand( this.getLhsExp().calc(), this.getRhsExp().calc() )
}
export const AND_OP = (new AndExp()).name();

export class OrExp extends BinExp
{
	name = () => 'Or';
	calc = () => uor(this.getLhsExp().calc(), this.getRhsExp().calc())
}
export const OR_OP = (new OrExp()).name();

export class NandExp extends BinExp
{
	name = () => 'Nand';
	calc = () => unot( uand(this.getLhsExp().calc(), this.getRhsExp().calc()) );
}
export const NAND_OP = (new NandExp()).name();

export class NorExp extends BinExp {
	name = () => 'Nor';
	calc = () => unot( uor(this.getLhsExp().calc(), this.getRhsExp().calc()) )
}
export const NOR_OP = (new NorExp()).name();

export class XorExp extends BinExp 
{
	name = () => 'Xor';
	calc = () => uor(
		uand( this.getLhsExp().calc(), unot(this.getRhsExp().calc()) ),
		uand( unot(this.getLhsExp().calc()), this.getRhsExp().calc() )
	);
}
export const XOR_OP = (new XorExp()).name();

