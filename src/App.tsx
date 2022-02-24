// import { lg } from './utils';

// UI (Interface).
import React from 'react';
import { ExpView } from './ExpView'

// Domain.
import { UNDEF_EXP, UNDEF, Exp, NotExp, TRUE, FALSE } from './Exp'

/* 	dummyRoot(Exp) is the parent of the actual Exp to be shown.
    
    (App)         (has dropdown)
    dummyRoot ---> visibleRoot-------------------------> xxxExp ... etc.
                       |-------------------------------> xxxExp ... etc.     
	
	dummyRoot enables the visibleRoot to be changed dynamically - something has to 'hold it' in reference form
	for this to happen. Selecting a new option (from the dropdown menu of visibleRoot) changes the visibleRoot
	by updating the reference held in dummyRoot.
*/

class DummyRoot extends NotExp {} // purely for clarity of intent - DummyRoot.

interface State
{
	constructor(public dummyRoot: DummyRoot, public result: string, public textExp: string) {};
}

class App extends React.Component<{}, State>
{
	createState = (dummyRoot: DummyRoot): State =>
	{
		const textExp = dummyRoot.getSubExp().expand();
		let result = ''; 

		let r = dummyRoot.getSubExp().calc();
		result = (r === undefined) ? UNDEF : ( r ? TRUE : FALSE);
		
		return new State(dummyRoot, result, textExp);
	}

	visibleRoot = () => this.state.dummyRoot.getSubExp();

	constructor(props = {})
	{
		super(props);

		const startExp = UNDEF_EXP;
		const dummyRoot = new DummyRoot(startExp);
		this.state = this.createState(dummyRoot);
	}

	updateState = () => 
	{
		this.setState( this.createState(this.state.dummyRoot) );
	}

	updateDummyRoot = (e: Exp) =>
	{
		this.state.dummyRoot.setSubExp(e);		
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
					<p className='md-font tal'>Thanks for upgrading - you can now use: Xor, Nand and Nor</p>
				</header>

				<div className='tal lg-font flex-horiz'>
					<p className='exp-width'>Expression:</p> 
					<p className=''>{this.state.textExp}</p>
				</div>
				<div className='tal lg-font flex-horiz bot-margin'>
					<p className='exp-width'>Result:</p> 
					<p className=''>{this.state.result}</p>
				</div>

				<ExpView
					exp={this.visibleRoot()}
					parentUpdateCb={this.updateDummyRoot}
					requestAppStateBeUpdatedCb={this.updateState}
				/>
			</div>
		);
	}
}

export default App;
