import { lg } from './utils';

// UI (Interface)
import React from 'react';
import { ExpView } from './ExpView'

// Domain
import { undefExp, Exp, NotExp, BinExp, AND, OR, trueExp, falseExp, NoEvalError  } from './Exp'

// visuals
import './style.css';

/* 	dummyRootExp is the parent of the actual Exp to be shown.
    
    (App)         (has dropdown)
    dummyRoot ---> visibleRoot-------------------------> xxxExp ... etc.
                       |-------------------------------> xxxExp ... etc.     
	
	dummyRoot enables the visibleRoot to be changed dynamically - something has to 'hold it' if reference form
	for this to happen. Selecting a new option (from the dropdown menu of visible) changes the visibleRoot
	by updating the contents of dummyRoot.
*/

class DummyRoot extends NotExp {} // purely for clarity... s

class State
{
	constructor(public dummyRoot: Exp, public result: string, public textExp: string) {};
}

class App extends React.Component<{}, State> 
{
	visibleRoot = () => this.state.dummyRoot.getsubexp();

	calcState = (dummyRoot: DummyRoot): State =>
	{
		const textExp = this.visibleRoot().expand();
		
		let result = ''; 

		try {
			result = this.visibleRoot().calc() ? 'TRUE' : 'FALSE';
		}
		catch (e)
		{
			lg('[Attempted to calculate an undefined value]');

			if (e instanceof NoEvalError) 
				result = undefExp.name();	
			else
				throw(e);	// some other error...
		}

		return new State(dummyRoot, result, textExp);
	}

	constructor(props = {})
	{
		super(props);

		const startExp = undefExp;
		/* 	
		for debug or personal amusement, try:
			new NotExp( 
				new BinExp( 
					OR, 
					new BinExp( 
						AND, 
						new NotExp( new NotExp( new NotExp(trueExp) ) ), 
						new NotExp(falseExp) 	
					), 
					falseExp 
				) 
			); 
		*/

		const dummyRoot = new NotExp(startExp);
		this.state = this.calcState(dummyRoot);
	}

	updateState = () => 
	{
		this.setState( this.calcState(this.state.dummyRoot) );
		
		lg( "App Level Tree Expansion: ", this.state.dummyRoot.expand() );
	}

	updateDummyRoot = (e: Exp) =>
	{
		(this.state.dummyRoot as NotExp).setsubexp(e);		
		this.setState(this.calcState(this.state.dummyRoot));

		return e;
	}

	render()
	{
		return (
			<div className="app">
				<header className="app-header tac botmargin">
					De-luxe Boolean Expression Calculator
					<p className='smfont'>for all your boolean evaluation needs</p>
					<p className='smfont'>please *upgrade* to paid edition (only EU99.99/month) to access our patented XOR functionality</p>
				</header>

				<div className='tal lgfont flex-horiz'>
					<p className='expwidth'>EXPRESSION:</p> 
					<p className=''>{this.state.textExp}</p>
				</div>
				<div className='tal lgfont flex-horiz botmargin'>
					<p className='expwidth'>RESULT:</p> 
					<p className='expwidth'>{this.state.result}</p>
				</div>

				<ExpView
					exp={this.visibleRoot()}
					parentUpdateFn={this.updateDummyRoot}
					globalUpdateFn={this.updateState}
				/>
			</div>
		);
	}
}

export default App;
