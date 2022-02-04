
import {
	AND, OR, Exp, BinExp, falseExp, trueExp, NOT, UNDEF, AppError, NoEvalError, UndefExp, NotExp, ConstExp, LB, RB, DIV, TRUE, FALSE
} from './exp'

const assert = (v: boolean)  => { if (!v) throw 'error'; }

// Tests (part 1)
describe(`test basic type creation`, function()
{
	it('** create exp throws app errors', function()
	{
		expect( () => new Exp().name() ).toThrow(AppError);
		expect( () => new Exp().calc() ).toThrow(AppError);
	});

	it('** undefined expression throw no-eval error on calc', function()
	{
		expect( () => new UndefExp().calc() ).toThrow(NoEvalError);
	});

	it('** true/false constants to evaluate correctly', function()
	{
		assert( new ConstExp(true).calc() );
		assert( ! new ConstExp(false).calc() );
	});

	it('** Not (Uni) expression evaluates correctly', function()
	{
		assert( new NotExp(new ConstExp (false)).calc() );
		assert( ! new NotExp(new ConstExp (true)).calc() );
	});

	it('** Not expression expands (to string representation) correctly', function()
	{
		const f = falseExp;
		const fname = f.name();

		const not = new NotExp(f);
		const notname = not.name();

		assert( not.expand() === notname + LB + fname + RB );
	});

	it('** AND expressions evaluation correctly', function()
	{

		assert( new BinExp( AND, trueExp, trueExp ).calc() );
		assert( ! new BinExp( AND, trueExp, falseExp ).calc() );
		assert( ! new BinExp( AND, falseExp, trueExp ).calc() );
		assert( ! new BinExp( AND, falseExp, falseExp ).calc() );
	});

	it('** OR expressions evaluation correctly', function()
	{
		assert( new BinExp( OR, trueExp, trueExp ).calc() );
		assert( new BinExp( OR, trueExp, falseExp ).calc() );
		assert( new BinExp( OR, falseExp, trueExp ).calc() );
		assert( ! new BinExp( OR, falseExp, falseExp ).calc() );
	});

	it('** AND / OR expressions expand to strings correctly', function()
	{
		const t = trueExp.name();

		assert( new BinExp( AND, trueExp, trueExp ).expand() === AND + LB + t + DIV + t + RB);
		assert( new BinExp( OR, trueExp, trueExp ).expand() === OR + LB + t + DIV + t + RB);
	});

	it('** Deeper nested expression with UNDEF throws exception', function() 
	{
		const e = 
			new BinExp( 
				AND,
				new BinExp( 
					OR,
					trueExp,
					falseExp
				)
				// default second arg to UndefExp ...UndefExp
			);

		expect( () => e.calc() ).toThrow(NoEvalError);
	});
	
	it('** Deeper nested expression expands to string correctly', function() 
	{
		const e = 
			new BinExp( // AND 
				AND,
				new BinExp( // OR ( T, F)
					OR, 
					trueExp,
					falseExp
				),
				new NotExp( falseExp ) // NOT ( F )
			);
		
		// AND(OR(TRUE,FALSE),NOT(FALSE))
		assert( e.expand() === AND + LB + OR + LB + TRUE + DIV + FALSE + RB + DIV + NOT + LB + FALSE + RB + RB );
	});

	it('** Deeper nested expression evaluates correctly', function() 
	{
		const e = 
			new BinExp( // TRUE
				AND,
				new BinExp( // TRUE.
					OR, 
					trueExp,
					falseExp
				),
				new NotExp( falseExp ) // TRUE
			);
		assert( e.calc() );
	}); 
});