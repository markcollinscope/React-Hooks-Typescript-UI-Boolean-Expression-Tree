import React from 'react';

import { lg } from './utils'
// basic case - UNDEF, TRUE or FALSE value.

import { Exp, BinExp, NotExp, UNDEF_EXP, TRUE_EXP, FALSE_EXP, NOT, AND, OR, UNDEF, TRUE, FALSE } from './Exp';
import { ConstExpView } from './ConstExpView';

interface Props
{
	exp: Exp;
	parentUpdateFn:	(e: Exp) => Exp;
	globalUpdateFn: () => void;
};

class State
{
	constructor(public thisExpRoot: Exp, public selected: string) {}
};

export type OptionCbType = {[index: string]: () => Exp};

const dropDownCbs =
{
	UNDEF:	() => { lg("Dropdown select: ", UNDEF); return UNDEF_EXP; },
	TRUE: 	() => { lg("Dropdown select: ", TRUE); return TRUE_EXP; },
	FALSE: 	() => { lg("Dropdown select: ", FALSE); return FALSE_EXP; },
	AND:	() => { lg("Dropdown select: ", AND); return new BinExp(AND); },
	OR:		() => { lg("Dropdown select: ", OR); return new BinExp(OR); },
	NOT:	() => { lg("Dropdown select: ", NOT); return new NotExp(); }
} as OptionCbType;

// Recursively instantiated React class. 
// Expresssions with sub-expressions recursively use ExpView (within an outer ExpView).
export class ExpView extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.state = new State(props.exp, props.exp.name());
	}

	handleDropDownUpdate = (value: string) =>
	{
		const newRoot = this.props.parentUpdateFn( dropDownCbs[value]() );

		lg("Dropdown Select Exp Now: ", newRoot.expand())

		const newState = new State(newRoot, value);
		this.setState(newState);
		this.props.globalUpdateFn();
	}

	render()
	{
		// basic case - UNDEF, TRUE or FALSE value.
		let viewExpToReturn = 
			<div className='bdr md-font exp-width'>
			<ConstExpView 
				options={ Object.keys(dropDownCbs) }
				onSelect={ this.handleDropDownUpdate }
				selected={ this.props.exp.name() }
			/>
			</div>


		if (this.props.exp instanceof NotExp)
		{
			const notExp = this.props.exp as NotExp // downcast to subclass.
		
			viewExpToReturn = 
				<div>
					{viewExpToReturn}
					<div className='vgap'/>
					<div className='lhs-margin'>
						<ExpView
							exp={notExp.getSubExp()}
							parentUpdateFn={notExp.setSubExp}
							globalUpdateFn={this.props.globalUpdateFn}						
						/>
					</div>
				</div>
		}
	
		if (this.props.exp instanceof BinExp)
		{
			const binExp = this.props.exp as BinExp;

			viewExpToReturn = 
				<div>
					{viewExpToReturn}
					<div className='vgap'/>
					<div className='lhs-margin'>
						<ExpView
							exp={binExp.getLhsExp()}
							parentUpdateFn={binExp.setLhsExp}
							globalUpdateFn={this.props.globalUpdateFn}
						/>
					</div>
					<div className='vgap'/>
					<div className='lhs-margin'>
						<ExpView 
							exp={binExp.getRhsExp()}
							parentUpdateFn={binExp.setRhsExp}
							globalUpdateFn={this.props.globalUpdateFn}
						/>
					</div>
				</div>
		}
		
		return viewExpToReturn;
	}
}
