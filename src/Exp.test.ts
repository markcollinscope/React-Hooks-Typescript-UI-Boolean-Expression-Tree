import { assert } from './utils';

import { AppError } from './AppError'

import {
	AND_OP, OR_OP, Exp, BinExp, FALSE_EXP, TRUE_EXP, NOT_OP, UndefExpError, UNDEF_EXP, NotExp, LB, RB, SEPERATOR, TRUE, FALSE
} from './Exp'

// Tests (part 1)
describe(`test Exp and subclasses - creation, evaluation and expansion to string`, function()
{
	it('** create exp throws app errors', function()
	{
		expect( () => new Exp().name() ).toThrow(AppError);
		expect( () => new Exp().calc() ).toThrow(AppError);
	});

	it('** undefined expression throw no-eval error on calc', function()
	{
		expect( () => UNDEF_EXP.calc() ).toThrow(UndefExpError);
	});

	it('** true/false constants to evaluate correctly', function()
	{
		assert( TRUE_EXP.calc() );
		assert( ! FALSE_EXP.calc() );
	});

	it('** Not (Uni) expression evaluates correctly', function()
	{
		assert( new NotExp(FALSE_EXP).calc() );
		assert( ! new NotExp(TRUE_EXP).calc() );
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

		assert( new BinExp( AND_OP, TRUE_EXP, TRUE_EXP ).calc() );
		assert( ! new BinExp( AND_OP, TRUE_EXP, FALSE_EXP ).calc() );
		assert( ! new BinExp( AND_OP, FALSE_EXP, TRUE_EXP ).calc() );
		assert( ! new BinExp( AND_OP, FALSE_EXP, FALSE_EXP ).calc() );
	});

	it('** OR_OP expressions evaluation correctly', function()
	{
		assert( new BinExp( OR_OP, TRUE_EXP, TRUE_EXP ).calc() );
		assert( new BinExp( OR_OP, TRUE_EXP, FALSE_EXP ).calc() );
		assert( new BinExp( OR_OP, FALSE_EXP, TRUE_EXP ).calc() );
		assert( ! new BinExp( OR_OP, FALSE_EXP, FALSE_EXP ).calc() );
	});

	it('** AND_OP / OR_OP expressions expand to strings correctly', function()
	{
		const t = TRUE_EXP.name();

		assert( new BinExp( AND_OP, TRUE_EXP, TRUE_EXP ).expand() === AND_OP + LB + t + SEPERATOR + t + RB);
		assert( new BinExp( OR_OP, TRUE_EXP, TRUE_EXP ).expand() === OR_OP + LB + t + SEPERATOR + t + RB);
	});

	it('** Deeper nested expression with UNDEF throws exception', function() 
	{
		const e = 
			new BinExp( 
				AND_OP,
				new BinExp( 
					OR_OP,
					TRUE_EXP,
					FALSE_EXP
				)
				// default second arg to UndefExp ...UndefExp
			);

		expect( () => e.calc() ).toThrow(UndefExpError);
	});
	
	it('** Deeper nested expression expands to string correctly', function() 
	{
		const e = 
			new BinExp( // AND_OP 
				AND_OP,
				new BinExp( // OR_OP ( T, F)
					OR_OP, 
					TRUE_EXP,
					FALSE_EXP
				),
				new NotExp( FALSE_EXP ) // NOT_OP ( F )
			);
		
		// AND_OP(OR_OP(TRUE,FALSE),NOT_OP(FALSE))
		assert( e.expand() === AND_OP + LB + OR_OP + LB + TRUE + SEPERATOR + FALSE + RB + SEPERATOR + NOT_OP + LB + FALSE + RB + RB );
	});

	it('** Deeper nested expression evaluates correctly', function() 
	{
		const e = 
			new BinExp( // TRUE
				AND_OP,
				new BinExp( // TRUE.
					OR_OP, 
					TRUE_EXP,
					FALSE_EXP
				),
				new NotExp( FALSE_EXP ) // TRUE
			);
		assert( e.calc() );
	}); 
});