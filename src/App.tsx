// import { lg } from './utils';

// UI (Interface).
import React from 'react';
import { ExpView } from './ExpView'

// Domain.
import { UNDEF_EXP, Exp, NotExp, uBoolToName } from './Exp'

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
	res:		string;
	textExp:	string;
}

class App extends React.Component<{}, State>
{
	visibleRoot = () => this.state.dummyRoot.getSubExp();

	calcRes = (e: Exp) => uBoolToName( e.calc() );
	getExpansion = (e: Exp) => e.expand();

	constructor(props = {})
	{
		super(props);
		let dummy = new DummyRoot(UNDEF_EXP);

		this.state =
		{
			dummyRoot:	dummy,
			res:		this.calcRes(dummy.getSubExp()),
			textExp:	this.getExpansion(dummy.getSubExp())
		}
	}

	resetStateDependencies = () =>
	{
		const root = this.state.dummyRoot;
		let newState = 
		{
			dummyRoot: 	root,
			res: 		this.calcRes( this.visibleRoot() ),
			textExp: 	this.getExpansion( this.visibleRoot() )
		}

		this.setState(newState);
	}

	updateVisibleRoot = (newExp: Exp) =>
	{
		this.state.dummyRoot.setSubExp(newExp);

		this.resetStateDependencies();
		return newExp;
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
					<p className='exp-width'>Res:</p> 
					<p className=''>{this.state.res}</p>
				</div>

				<ExpView
					exp={this.visibleRoot()}
					parentUpdateCb={this.updateVisibleRoot}
					requestAppStateBeUpdatedCb={this.resetStateDependencies}
				/>
			</div>
		);
	}
}

export default App;
