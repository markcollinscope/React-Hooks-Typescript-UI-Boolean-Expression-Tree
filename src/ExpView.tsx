// React Component: ExpView. 

// visual representation of boolean expressions - done in such a way as to enable 
// the dynamic construction of complex nested expressions (and, or, not ...), 
// to an arbitrary depth, including allowing undefined elements and the use of boolean constants.

// provides the UI side of Exp.ts - recursively displaying and enabling the modification 
// at any point in the expressions hierarchy.

import { ExpNodePartView } from './ExpNodePartView';

// boolean expressions - types(classes) and constants.
import { 
	Exp, BinExp, NotExp, AndExp, OrExp, NandExp, NorExp, XorExp, XOR_OP, NAND_OP, NOR_OP, UNDEF_EXP, TRUE_EXP, 
	FALSE_EXP, NOT_OP, AND_OP, OR_OP, UNDEF, TRUE, FALSE
} from './Exp';

const displayNotExp = (e: NotExp, updateAppCalculations: () => void): JSX.Element => {
	return (
		<div>
			<div />
			<div className='lhs-indent'>
				<ExpView
					exp={e.getSubExp()}
					parentUpdateCb={e.setSubExp}
					requestAppStateBeUpdatedCb={updateAppCalculations}
				/>
			</div>
		</div>
	);
}

const displayBinExp = (e: BinExp, updateAppCalculations: () => void): JSX.Element => {
	return (
		<div>
			<div className='lhs-indent'>
				<ExpView
					exp={e.getLhsExp()}
					parentUpdateCb={e.setLhsExp}
					requestAppStateBeUpdatedCb={updateAppCalculations}
				/>
			</div>
			<div />
			<div className='lhs-indent'>
				<ExpView
					exp={e.getRhsExp()}
					parentUpdateCb={e.setRhsExp}
					requestAppStateBeUpdatedCb={updateAppCalculations}
				/>
			</div>
		</div>
	);
}

const displayNoSubExp = (e: Exp, updateAppCalculations: () => void): JSX.Element => {
	return <p></p>;
}

type ExpNameSpecificBehaviour = { exp: () => Exp, display: (e: Exp, appCalc: () => void) => JSX.Element };
type ExpNameToBehaviourMap = { [index: string]: ExpNameSpecificBehaviour };

const expFactory = {
	[UNDEF]: 		{ exp: () => UNDEF_EXP, 	display: displayNoSubExp },
	[TRUE]: 		{ exp: () => TRUE_EXP, 		display: displayNoSubExp },
	[FALSE]: 		{ exp: () => FALSE_EXP, 	display: displayNoSubExp },
	[NOT_OP]: 		{ exp: () => new NotExp(), 	display: displayNotExp },
	[AND_OP]: 		{ exp: () => new AndExp(), 	display: displayBinExp },
	[OR_OP]: 		{ exp: () => new OrExp(), 	display: displayBinExp },
	[NAND_OP]: 		{ exp: () => new NandExp(), display: displayBinExp },
	[NOR_OP]: 		{ exp: () => new NorExp(), 	display: displayBinExp },
	[XOR_OP]: 		{ exp: () => new XorExp(), 	display: displayBinExp }
} as ExpNameToBehaviourMap;

interface Props {
	// as shown in 'this' instance of ExpView.
	exp: 						Exp;
	parentUpdateCb: 			(e: Exp) => Exp;
	requestAppStateBeUpdatedCb: () => void;
};

export function ExpView(props: Props) {
	console.log(`ExpView Fn Render, props.exp: ${props.exp.name()}`)

	const handleSelectionFromDropDownMenu = (value: string) => {
		const e = expFactory[value].exp();
		props.parentUpdateCb(e);
		console.log(`ExpView updated parent with: ${e.name()}`)
		props.requestAppStateBeUpdatedCb(); // React *cannot* do this automatically!
	}

	const viewToDisplay = 
		<div>
			<div className='bdr md-font exp-width'>
				<ExpNodePartView 
					options=	{ Object.keys(expFactory) }
					onSelect=	{ handleSelectionFromDropDownMenu }
					selected=	{ props.exp.name() }
				/>
			</div>
			<div/>
			{expFactory[props.exp.name()].display(props.exp, props.requestAppStateBeUpdatedCb)}
		</div>
		
	return viewToDisplay;
}
