
import * as exp from './exp'

const assert = (v: boolean)  => { if (!v) throw 'error'; }

// Tests (part 1)
describe(`test basic type creation`, function()
{
	it('** create exp throws app errors', function()
	{
		expect( () => new exp.Exp().name() ).toThrow(exp.AppError);
		expect( () => new exp.Exp().calc() ).toThrow(exp.AppError);
	});

	it('** undefined expression throw no-eval error on calc', function()
	{
		expect( () => new exp.UndefExp().calc() ).toThrow(exp.NoEvalError);
	});

	it('** true/false constants to evaluate correctly', function()
	{
		assert( new exp.ConstExp(true).calc() );
		assert( ! new exp.ConstExp(false).calc() );
	});

	it('** Not (Uni) expression evaluates correctly', function()
	{
		assert( new exp.NotExp(new exp.ConstExp (false)).calc() );
		assert( ! new exp.NotExp(new exp.ConstExp (true)).calc() );
	});

	it('** Not expression expands (to string representation) correctly', function()
	{
		const f = exp.falseExp;
		const fname = f.name();

		const not = new exp.NotExp(f);
		const notname = not.name();

		assert( not.expand() === notname + exp.LB + fname + exp.RB );
	});

	it('** AND expressions evaluation correctly', function()
	{

		assert( new exp.BinExp( exp.AND, exp.trueExp, exp.trueExp ).calc() );
		assert( ! new exp.BinExp( exp.AND, exp.trueExp, exp.falseExp ).calc() );
		assert( ! new exp.BinExp( exp.AND, exp.falseExp, exp.trueExp ).calc() );
		assert( ! new exp.BinExp( exp.AND, exp.falseExp, exp.falseExp ).calc() );
	});

	it('** OR expressions evaluation correctly', function()
	{
		assert( new exp.BinExp( exp.OR, exp.trueExp, exp.trueExp ).calc() );
		assert( new exp.BinExp( exp.OR, exp.trueExp, exp.falseExp ).calc() );
		assert( new exp.BinExp( exp.OR, exp.falseExp, exp.trueExp ).calc() );
		assert( ! new exp.BinExp( exp.OR, exp.falseExp, exp.falseExp ).calc() );
	});

	it('** AND / OR expressions expand to strings correctly', function()
	{
		const t = exp.trueExp.name();

		assert( new exp.BinExp( exp.AND, exp.trueExp, exp.trueExp ).expand() === exp.AND + exp.LB + t + exp.DIV + t + exp.RB);
		assert( new exp.BinExp( exp.OR, exp.trueExp, exp.trueExp ).expand() === exp.OR + exp.LB + t + exp.DIV + t + exp.RB);
	});

	it('** Deeper nested expression with UNDEF throws exception', function() 
	{
		const e = 
			new exp.BinExp( 
				exp.AND,
				new exp.BinExp( 
					exp.OR,
					exp.trueExp,
					exp.falseExp
				)
				// default second arg to UndefExp ...UndefExp
			);

		expect( () => e.calc() ).toThrow(exp.NoEvalError);
	});
	
	it('** Deeper nested expression expands to string correctly', function() 
	{
		const e = 
			new exp.BinExp( // AND 
				exp.AND,
				new exp.BinExp( // OR ( T, F)
					exp.OR, 
					exp.trueExp,
					exp.falseExp
				),
				new exp.NotExp( exp.falseExp ) // NOT ( F )
			);
		
		// AND(OR(TRUE,FALSE),NOT(FALSE))
		assert( e.expand() === exp.AND + exp.LB + exp.OR + exp.LB + exp.TRUE + exp.DIV + exp.FALSE + exp.RB + exp.DIV + exp.NOT + exp.LB + exp.FALSE + exp.RB + exp.RB );
	});

	it('** Deeper nested expression evaluates correctly', function() 
	{
		const e = 
			new exp.BinExp( // TRUE
				exp.AND,
				new exp.BinExp( // TRUE.
					exp.OR, 
					exp.trueExp,
					exp.falseExp
				),
				new exp.NotExp( exp.falseExp ) // TRUE
			);
		assert( e.calc() );
	}); 
});