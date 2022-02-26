// import { lg } from './utils';

// UI (Interface).
import { useState } from 'react';
import { ExpView } from './ExpView'

// Domain.
import { UNDEF_EXP, Exp, NotExp, uBoolToName } from './Exp'

/* 	dummyRoot(Exp) is the parent of the actual Exp to be shown.
    
    (App)         (has dropdown)
    dummyRoot ---> visibleRoot-------------------------> xxxExp ... etc.
                       |-------------------------------> xxxExp ... etc.     
	
	dummyRoot enables the visibleRoot to be changed dynamically - something has to 'hold it' in reference form
	for this to happen. Selecting a new option (from the dropdown menu of visibleRoot) changes the visibleRoot
	by updating the reference held in dummyRoot (or another Exp node if deeper in Exp).

	there are other possible approaches... this is a bit of a classic comp-sci solution.
*/

class DummyRoot extends NotExp {}

function App()
{
	const calcRes = (e: Exp) => uBoolToName( e.calc() );
	const getExpansion = (e: Exp) => e.expand();
	const visibleRoot = () => dummyRoot.getSubExp();

	// all state.
	const [dummyRoot, setDummyRoot] = useState(new DummyRoot(UNDEF_EXP)); 
	const [ res, setRes ] 			= useState(calcRes(visibleRoot()));
	const [ textExp, setTextExp] 	= useState(getExpansion(visibleRoot()));

	const resetStateDependencies = () =>
	{
		setRes( calcRes(visibleRoot()) );
		setTextExp( getExpansion(visibleRoot()) );
	}

	const updateVisibleRoot = (newExp: Exp) =>
	{
		setDummyRoot(dummyRoot); // To get Typescript EsLint to STFU. Lol! Annoying react hooks t'ing.

		dummyRoot.setSubExp(newExp);
		resetStateDependencies();
		return newExp;
	}

	return (
		<div className="app">
			<header className="app-header tal bot-margin lg-font">
				De-luxe Boolean Expression Calculator
				<p className='md-font tal'>for all your boolean evaluation needs</p>
				<p className='md-font tal'>Thanks for upgrading - you can now use: Xor, Nand and Nor</p>
			</header>

			<div className='tal lg-font flex-horiz'>
				<p className='exp-width'>Expression:</p> 
				<p className=''>{textExp}</p>
			</div>
			<div className='tal lg-font flex-horiz bot-margin'>
				<p className='exp-width'>Res:</p> 
				<p className=''>{res}</p>
			</div>

			<ExpView
				exp={visibleRoot()}
				parentUpdateCb={updateVisibleRoot}
				requestAppStateBeUpdatedCb={resetStateDependencies}
			/>
		</div>
	);
}

export default App;
