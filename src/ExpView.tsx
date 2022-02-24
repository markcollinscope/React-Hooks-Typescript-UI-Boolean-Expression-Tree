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

interface Props
{
	exp:	Exp;	// Exp being shown in 'this' instance of ExpView.
	parentUpdateCb:	(e: Exp) => Exp;
	requestAppStateBeUpdatedCb: () => void;
};

interface State
{
	expRoot: 	Exp;
};

export type ExpFactoryCb = { [index: string]: () => Exp };

const dropDownMenuExpFactory =
{
	[UNDEF]:	()  => UNDEF_EXP,
	[TRUE]: 	() =>  TRUE_EXP,
	[FALSE]: 	() =>  FALSE_EXP,
	[NOT_OP]: 	() =>  new NotExp(),
	[AND_OP]:	() =>  new AndExp(),
	[OR_OP]:	() =>  new OrExp(),
	[NAND_OP]: 	() =>  new NandExp(),
	[NOR_OP]: 	() =>  new NorExp(),
	[XOR_OP]: 	() =>  new XorExp()
} as ExpFactoryCb;

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
		
		// i don't like having to use this fn so much... ongoing...
		this.props.requestAppStateBeUpdatedCb();
	}

	render()
	{
		// nb: this could do with a more generic, extensible mechanism.

		// basic cases - Undefined, True or False value or the 'core' part of a UI 'node' (e.g. box with
		// And, Or, Xor in it - that also has an associated drop down menu.
		let viewToRender = 
			<div className='bdr md-font exp-width'>
			<ConstExpView 
				options={ Object.keys(dropDownMenuExpFactory) }
				onSelect={ this.handleSelectionFromDropDownMenu }
				selected={ this.props.exp.name() }
			/>
			</div>

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
