import { lg } from './utils';

// UI (Interface)
import React from 'react';
import { ExpView } from './ExpView'

// Domain
import { UNDEF_EXP, Exp, NotExp, UndefExpError  } from './Exp'

/* 	dummyRoot(Exp) is the parent of the actual Exp to be shown.
    
    (App)         (has dropdown)
    dummyRoot ---> visibleRoot-------------------------> xxxExp ... etc.
                       |-------------------------------> xxxExp ... etc.     
	
	dummyRoot enables the visibleRoot to be changed dynamically - something has to 'hold it' if reference form
	for this to happen. Selecting a new option (from the dropdown menu of visibleRoot) changes the visibleRoot
	by updating the reference held indummyRoot.
*/

class DummyRoot extends NotExp {} // purely for clarity of intent... no functional difference - used as a container for visibleRoot.

class State
{
	constructor(public dummyRoot: DummyRoot, public result: string, public textExp: string) {};
}

class App extends React.Component<{}, State> 
{
	createState = (dummyRoot: DummyRoot): State =>
	{
		const textExp = dummyRoot.getSubExp().expand();
		let result = ''; 

		try {
			result = dummyRoot.getSubExp().calc() ? 'TRUE' : 'FALSE';
		}
		catch (e)
		{
			lg('[Attempted to calculate an undefined value]');

			if (e instanceof UndefExpError) 
				result = 'cannot be evaluated: UNDEFINED'
			else
				throw(e);	// some other error...
		}

		return new State(dummyRoot, result, textExp);
	}

	visibleRoot = () => this.state.dummyRoot.getSubExp();

	constructor(props = {})
	{
		super(props);

		const startExp = UNDEF_EXP;
		/* 	
		for debug or personal amusement(!), try:
			new NotExp( 
				new BinExp( 
					OR, 
					new BinExp( 
						AND, 
						new NotExp( new NotExp( new NotExp(TRUE_EXP) ) ), 
						new NotExp(FALSE_EXP) 	
					), 
					FALSE_EXP 
				) 
			); 
		*/

		const dummyRoot = new DummyRoot(startExp);
		this.state = this.createState(dummyRoot);
	}

	updateState = () => 
	{
		lg( "App Level Tree Expansion: ", this.state.dummyRoot.expand() );
		this.setState( this.createState(this.state.dummyRoot) );
	}

	updateDummyRoot = (e: Exp) =>
	{
		(this.state.dummyRoot).setSubExp(e);		
		this.setState(this.createState(this.state.dummyRoot));

		return e;
	}

	render()
	{
		return (
			<div className="app">
				<header className="app-header tal bot-margin">
					De-luxe Boolean Expression Calculator
					<p className='md-font tal'>for all your boolean evaluation needs</p>
					<p className='md-font tal'>please *upgrade* to paid edition (only EU99.99/month) to access our patented XOR functionality</p>
				</header>

				<div className='tal lg-font flex-horiz'>
					<p className='exp-width'>EXPRESSION:</p> 
					<p className=''>{this.state.textExp}</p>
				</div>
				<div className='tal lg-font flex-horiz bot-margin'>
					<p className='exp-width'>RESULT:</p> 
					<p className=''>{this.state.result}</p>
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
