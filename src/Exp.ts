// Abstraction of the concept of a boolean expression.
// Deals with creation and calcution of such expressions, including constants values (T, F), 
// binary operations, unary operations (well NOT_OP only at the moment), and undefined values.

/*
	Here's the grammar the Exp inheritance tree conforms to (or enables) below... (BNF format-ish):

	Exp ::= Exp | UndefExp | ConstExp | BinExp | NotExp
	NotExp :== 'Not' Exp 

	BinExp :== BinOp Exp Exp 	// nb: in this example at present, BinExp class does all of the BinOps...
	BinOp ::= 'And' | 'Or' | 'Xor' | 'Nand' | 'NorExp'

	ConstExp ::= TrueExp | FalseExp (no seperate class for these, could be though).
	UndefExp ::= 'Undefined'
	TrueExp ::= 'True'
	FalseExp ::= 'False'
*/

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
// abstract base class - which Typescript doesn't support directly, hence the progError stuff...
export class Exp  
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
export const UNDEF_EXP = 	new UndefExp();
export const UNDEF = 		UNDEF_EXP.name();

// a useful technique - a function that can be called to do checking - and can throw an exception if there's a problem.
// its useful because it makes the client code far cleaner without losing anything.
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
export const TRUE_EXP = 	new ConstExp(true);		// these are Expression types.
export const FALSE_EXP = 	new ConstExp(false);
export const TRUE = 		TRUE_EXP.name();		// these are string types.
export const FALSE = 		FALSE_EXP.name();

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
	
	calc = (): boolean => ! this.getSubExp().calc();
	name = () => 'Not';
	expand = () => this.name() + LB + this.getSubExp().expand() + RB;
}
export const NOT_OP = (new NotExp()).name();

//******
const LHS = '_Left_'	// arbitrary value.
const RHS = '_Right_'	// arbitrary value.

// for formatting of expressions when converting to expanded (string) visual representation.
// exported for tests (only).
export const LB = ' ( ';
export const RB = ' ) ';
export const SEPERATOR = ' , ';

// create BinExp (binary operator) with AND_OP or OR_OP op. nb: AND_OP etc. are used for visuals when expanded to string.
// nb: a valid criticism here coud be the the use of AND_OP, etc. in the UI conflates the business logic and the visual aspects
// of the system. As it stands, there's no real impact of violating 'best practice' rule - but that could change if this were
// extended further... so that should always be borne in mind.
export const AND_OP =   'And';
export const OR_OP = 	'Or';
export const NAND_OP = 	'Nand';
export const NOR_OP =  	'Nor';
export const XOR_OP = 	'Xor';

export class BinExp extends Exp
{
	private subexp: { [index: string] : Exp } = {};

	// extensible approach - though this is not strictly an OO approach, more a hybrid OO & FP approach.
	private static calcFn: { [index: string]: ( (l: Exp, r: Exp) => boolean ) } =
	{
		[AND_OP]: (l: Exp, r: Exp) => 	l.calc() && r.calc(),
		[OR_OP]:  (l: Exp, r: Exp) => 	l.calc() || r.calc(),
		[NAND_OP]: (l: Exp, r: Exp) =>  !( l.calc() && r.calc() ),
		[NOR_OP]:  (l: Exp, r: Exp) => 	!( l.calc() || r.calc() ),
		[XOR_OP]: (l: Exp, r: Exp) =>  	
		{
			const lv =  l.calc();
			const rv = 	r.calc();
			return (lv && !rv) || (rv && !lv);
		}
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
