// import { lg } from './utils';

// UI (Interface).
import React from 'react';
import { ExpView } from './ExpView'

// Domain.
import { UNDEF_EXP, UNDEF, Exp, NotExp, TRUE, FALSE, uBoolToName } from './Exp'

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
	dummyRoot: 	DummyRoot;
	result:		string;
	textExp:	string;
}

class App extends React.Component<{}, State>
{
	visibleRoot = () => this.state.dummyRoot.getSubExp();
	setVisibleRoot = (e: Exp) => this.state.dummyRoot.setSubExp(e);

	visibleResult = () => uBoolToName( this.visibleRoot().calc() );
	setVisibleResult = () => this.state.result = this.visibleResult();
		
	visibleText = () => this.visibleRoot().expand();
	setVisibleText = () => this.state.textExp = this.visibleText();

	constructor(props = {})
	{
		super(props);
		this.setVisibleRoot(new DummyRoot(UNDEF_EXP) );

		this.state =
		{
			dummyRoot:	dr,
			result:		r,
			textExp:	t
		}
	}

	updateVisibleExp = (e: Exp) =>
	{
		this.setVisibleExp(e);

		const newState = this.state;
		newState.result = 
		this.setState(this.newState(this.state.dummyRoot));
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
					parentUpdateCb={this.updateDummyRootChild}
					requestAppStateBeUpdatedCb={this.newState}
				/>
			</div>
		);
	}
}

export default App;
