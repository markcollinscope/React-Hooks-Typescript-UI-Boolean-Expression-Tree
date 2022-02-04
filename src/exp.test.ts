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

	it('** Not (Uni) expression expands (to string representation) correctly', function()
	{
		const f = new exp.ConstExp(false);
		const fname = f.name();

		const not = new exp.NotExp(f);
		const notname = not.name();

		assert( not.expand() === notname + exp.LB + fname + exp.RB );
	});

});