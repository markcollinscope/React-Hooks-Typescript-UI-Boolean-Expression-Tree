// React Component: ExpView. 

// visual representation of boolean expressions - done in such a way as to enable 
// the dynamic construction of complex nested expressions (and, or, not ...), 
// to an arbitrary depth, including allowing undefined elements and the use of boolean constants.

// provides the UI side of Exp.ts - recursively displaying and enabling the modification 
// at any point in the expressions hierarchy.
import React from 'react';
import { ConstExpView } from './ConstExpView';

// boolean expressions - types(classes) and constants.
import { 
	Exp, BinExp, NotExp, AndExp, OrExp, NandExp, NorExp, XorExp, XOR_OP, NAND_OP, NOR_OP, UNDEF_EXP, TRUE_EXP, 
	FALSE_EXP, NOT_OP, AND_OP, OR_OP, UNDEF, TRUE, FALSE
} from './Exp';

type ExpViewSpecifics 	= 	{ exp: Exp, render: (e: Exp) => string };
type ExpFactoryCb 		= 	{ ( [index: string]: ExpViewSpecifics };

interface Props
{
	exp: Exp;	// Exp being shown in 'this' instance of ExpView.
	parentUpdateCb:	(e: Exp) => Exp;
	requestAppStateBeUpdatedCb: () => void;
};

interface State
{
	expRoot: 	Exp;
};

export class ExpView extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.state =
		{
			expRoot: 	props.exp,
		}
	}

	handleSelectionFromDropDownMenu = (value: string) =>
	{
		const newRoot = this.props.parentUpdateCb( dropDownMenuExpFactory[value]() );

		let newState = this.state as State;
		newState.expRoot = newRoot;
		this.setState(newState);
		
		this.props.requestAppStateBeUpdatedCb(); // this is not different to a button onClick callback...
	}

	render()
	{
		const renderNotExp = (e: NotExp, updateAppCalculations: () => void) => {
			return (
				<div>
					<div className='vgap' />
					<div className='lhs-margin'>
						<ExpView
							exp={e.getSubExp()}
							parentUpdateCb={e.setSubExp}
							requestAppStateBeUpdatedCb={updateAppCalculations}
						/>
					</div>
				</div>
			);
		}

		const renderBinExp = (e: BinExp, updateAppCalculations: () => void) => {
			return (
				<div>
					<div className='lhs-margin'>
						<ExpView
							exp={e.getLhsExp()}
							parentUpdateCb={e.setLhsExp}
							requestAppStateBeUpdatedCb={updateAppCalculations}
						/>
					</div>
					<div className='vgap' />
					<div className='lhs-margin'>
						<ExpView
							exp={e.getRhsExp()}
							parentUpdateCb={e.setRhsExp}
							requestAppStateBeUpdatedCb={updateAppCalculations}
						/>
					</div>
				</div>
			);
		}

		renderNullExp = (e: Exp, updateAppCalculations: () => void) => {
			return "";
		}

		const dropDownMenuExpFactory =
		{
			[UNDEF]: () => { exp: UNDEF_EXP, render: renderNullExp },
			[TRUE]: () => { exp: TRUE_EXP, render: renderNullExp },
			[FALSE]: () => { exp: FALSE_EXP, render: renderNullExp }
			[NOT_OP]: () => { exp: new NotExp(), render: renderNotExp },
			[AND_OP]: () => { exp: new AndExp(), render: renderBinExp },
			[OR_OP]: () => { exp: new OrExp(), render: renderBinExp },
			[NAND_OP]: () => { exp: new NandExp(), render: renderBinExp },
			[NOR_OP]: () => { exp: new NorExp(), render: renderBinExp },
			[XOR_OP]: () => { exp: new XorExp(), render: renderBinExp }
			} as ExpFactoryCb;


		// basic cases - Undefined, True or False value or the 'core' part of a UI 'node' (e.g. box with
		// And, Or, Xor in it - that also has an associated drop down menu.
		let viewToRender = 
			<div>
				<div className='bdr md-font exp-width'>
					<ConstExpView 
						options={ Object.keys(dropDownMenuExpFactory.map( (k) => dropDownMenuExpFactory[k].exp )) }
						onSelect={ this.handleSelectionFromDropDownMenu }
						selected={ this.props.exp.name() }
					/>
				</div>
				<div className='vgap' />

		if (this.props.exp instanceof NotExp)
		{
			const notExp = this.props.exp;
			viewToRender = 
				<div>
					{viewToRender}
					<div className='vgap'/>
					<div className='lhs-margin'>
						<ExpView
							exp={notExp.getSubExp()}
							parentUpdateCb={notExp.setSubExp}
							requestAppStateBeUpdatedCb={this.props.requestAppStateBeUpdatedCb}						
						/>
					</div>
				</div>
		}
		 
		if (this.props.exp instanceof BinExp)
		{
			const binExp = this.props.exp;

			viewToRender = 
				<div>
					{viewToRender}
					<div className='vgap'/>
					<div className='lhs-margin'>
						<ExpView
							exp={binExp.getLhsExp()}
							parentUpdateCb={binExp.setLhsExp}
							requestAppStateBeUpdatedCb={this.props.requestAppStateBeUpdatedCb}
						/>
					</div>
					<div className='vgap'/>
					<div className='lhs-margin'>
						<ExpView 
							exp={binExp.getRhsExp()}
							parentUpdateCb={binExp.setRhsExp}
							requestAppStateBeUpdatedCb={this.props.requestAppStateBeUpdatedCb}
						/>
					</div>
				</div>
		}
		
		return viewToRender;
	}
}
