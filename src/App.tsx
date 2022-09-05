// import { lg } from './utils';

// UI (Interface).
import { useState } from 'react';
import { ExpView } from './ExpView';
import { eqExtensionFn } from './extendExp';

// Domain.
import { UNDEF_EXP, Exp, NotExp, uBoolToName } from './Exp'

/* 	dummyRoot(Exp) is the parent of the actual Exp to be shown.
    
    (App)         (has dropdown)
    dummyRoot ---> visibleRoot-------------------------> xxxExp ... etc.
                       |-------------------------------> xxxExp ... etc.     
	
	dummyRoot enables the visibleRoot to be changed dynamically - something has to 'hold it' in reference form
	for this to happen. Selecting a new option (from the dropdown menu of visibleRoot) changes the visibleRoot
	by updating the reference held in dummyRoot (or another Exp node if deeper in an expression hierarchy).

	there are other possible approaches... this is a bit of a classic comp-sci solution.
*/

class DummyRoot extends NotExp {}

eqExtensionFn();	// extend functionality.

function App()
{
	const visibleRoot = () => dummyRoot.getSubExp();
	const calcRes = (e: Exp) => uBoolToName(e.calc());

	// all state.
	const [dummyRoot,] 				= useState(new DummyRoot(UNDEF_EXP)); 
	const [res, setRes] 			= useState(calcRes(visibleRoot()));
	const [textExp, setTextExp] 	= useState(visibleRoot().expand());

	console.log(`App Fn Render, res: ${res}, text: ${textExp}`)

	const updateVisibleRoot = (newExp: Exp) =>
	{
		console.log(`App Fn updateVisibleRoot Exp.name: ${newExp.name()}`)
		dummyRoot.setSubExp(newExp);
		updateCalcResultsArea();
		return newExp;
	}

	const updateCalcResultsArea = () => {
		setRes(calcRes(visibleRoot()));
		setTextExp(visibleRoot().expand());
	}

	return (
		<div>
			<header className="red tal bm lg-font">
				De-luxe Boolean Expression Calculator
				<p className='md-font'>for all your boolean evaluation needs</p>
			</header>

			<section id='resultsArea' className='orange bm'>
				<div className='tal lg-font flex-horiz'>
					<p className='exp-width'>Expression:</p> 
					<p>{textExp}</p>
				</div>
				<div className='tal lg-font flex-horiz bm'>
					<p className='exp-width'>Result:</p> 
					<p>{res}</p>
				</div>
			</section>

			<section id='expressionArea'>
				<ExpView
					exp={visibleRoot()}
					parentUpdateCb={updateVisibleRoot}
					requestAppStateBeUpdatedCb={updateCalcResultsArea}
				/>
			</section>
		</div>
	);
}
export default App;
