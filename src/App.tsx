import { lg } from './utils';

// UI (Interface)
import React from 'react';
import { NoEvalError, ExpView, NotExp, BinExp, AND, OR, trueExp, falseExp } from './ExpView'

// Domain
import { undefExp } from './Exp'

// visuals
import './style.css';

function App() 
{
	let initExp = 
		new BinExp(
			OR,
			new BinExp(
				AND,
				new NotExp( 
					new NotExp( 
						new NotExp(trueExp) 
					) 
				),
				new NotExp(falseExp)
			),
			falseExp
		);

	let textExp = undefExp.name();
	let result = undefExp.name();

	try {
		result  = initExp.calc() ? 'TRUE' : 'FALSE'
	}
	catch (e)
	{
		lg('catch undef')
		if (e instanceof NoEvalError) result = undefExp.name();
	}

	textExp = initExp.expand();

	return (
		<div className="App">
			<header className="App-header tac botmargin">
				De-luxe Boolean Expression Calculator
				<p className='smfont'>for all your boolean evaluation needs</p>
				<p className='smfont'>please *upgrade* to paid edition (only EU99.99/month) to access our patented XOR functionality</p>
			</header>

			<div className='tal lgfont flex-horiz'>
				<p className='expwidth'>EXPRESSION:</p> 
				<p className='expwidth'>{textExp}</p>
			</div>
			<div className='tal lgfont flex-horiz botmargin'>
				<p className='expwidth'>RESULT:</p> 
				<p className='expwidth'>{result}</p>
			</div>

			<ExpView
				exp={initExp}
				onUpdate={ (result: boolean, expansion: string) => {} }
			/>
		</div>
	);
}

export default App;
