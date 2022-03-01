import { assert } from './utils';

import {
	AndExp, OrExp, AND_OP, OR_OP, FALSE_EXP, TRUE_EXP, NOT_OP, UNDEF_EXP, NotExp, LB, RB, SEPERATOR, TRUE, FALSE
} from './Exp'

describe(`test Exp and subclasses - creation, evaluation and expansion to string`, function()
{
	it('** undefined expression throw no-eval error on calc', function()
	{
		assert(UNDEF_EXP.calc() === undefined);
	});

	it('** true/false constants to evaluate correctly', function()
	{
		assert( TRUE_EXP.calc() === true );
		assert( FALSE_EXP.calc() === false );
	});

	it('** Not expression evaluates correctly', function()
	{
		assert( new NotExp(FALSE_EXP).calc() === true);
		assert( new NotExp(TRUE_EXP).calc() === false);
	});

	it('** Not expression expands (to string representation) correctly', function()
	{
		const f = FALSE_EXP;
		const fname = f.name();

		const not = new NotExp(f);
		const notname = not.name();

		assert( not.expand() === notname + LB + fname + RB );
	});

	it('** AND_OP expressions evaluation correctly', function()
	{
		assert(new AndExp(TRUE_EXP, TRUE_EXP).calc() === true );
		assert(new AndExp(TRUE_EXP, FALSE_EXP).calc() === false );
		assert(new AndExp(FALSE_EXP, TRUE_EXP).calc() === false);
		assert(new AndExp(FALSE_EXP, FALSE_EXP).calc() === false);
	});

	it('** OR_OP expressions evaluation correctly', function()
	{
		assert(new OrExp(TRUE_EXP, TRUE_EXP).calc() === true);
		assert(new OrExp(TRUE_EXP, FALSE_EXP).calc() === true);
		assert(new OrExp(FALSE_EXP, TRUE_EXP).calc() === true);
		assert(new OrExp(FALSE_EXP, FALSE_EXP).calc() === false);
	});

	it('** AND_OP / OR_OP expressions expand to strings correctly', function()
	{
		const t = TRUE_EXP.name();

		assert( new AndExp(TRUE_EXP, TRUE_EXP).expand() === AND_OP + LB + t + SEPERATOR + t + RB);
		assert( new OrExp(TRUE_EXP, TRUE_EXP).expand() === OR_OP + LB + t + SEPERATOR + t + RB);
	});

	it('** Deeper nested expression with UNDEF throws exception', function() 
	{
		const e = 
			new AndExp( 
				new OrExp( 
					TRUE_EXP,
					FALSE_EXP
				)
				// default second arg to UndefExp ...UndefExp
			);

		assert(e.calc() === undefined);
	});
	
	it('** Deeper nested expression expands to string correctly', function() 
	{
		const e = 
			new AndExp(
				new OrExp(
					TRUE_EXP,
					FALSE_EXP
				),
				new NotExp( FALSE_EXP )
			);
		
		// AND_OP(OR_OP(TRUE,FALSE),NOT_OP(FALSE))
		assert( e.expand() === AND_OP + LB + OR_OP + LB + TRUE + SEPERATOR + FALSE + RB + SEPERATOR + NOT_OP + LB + FALSE + RB + RB );
	});

	it('** Deeper nested expression evaluates correctly', function() 
	{
		const e =
			new AndExp(
				new OrExp(
					TRUE_EXP,
					FALSE_EXP
				),
				new NotExp(FALSE_EXP)
			);
		assert( e.calc() === true );
	}); 
});