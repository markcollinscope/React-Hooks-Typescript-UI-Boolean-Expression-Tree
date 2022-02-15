// visual representation of boolean expressions - done in such a way as to enable 
// the dynamic construction of complex nested expressions (and, or, not ...), 
// including allowing undefined elements and the use of boolean constants.

// provides the UI side of Exp.ts - see expression logic below.

import React from 'react';
import { ConstExpView } from './ConstExpView';

// debug... remove from production code (or extend with a proper logging mechanism).
import { lg } from './utils'

// boolean expressions - core logic, types(classes) and constants.
// as this list has grown, I would now 
// "import * as exp from './Exp"' - soon!
import { Exp, BinExp, NotExp, XOR_OP, NAND_OP, NOR_OP, UNDEF_EXP, TRUE_EXP, FALSE_EXP, NOT_OP, AND_OP, OR_OP, UNDEF, TRUE, FALSE } from './Exp';
import { preProcessFile } from 'typescript';

interface Props
{
	exp: 			Exp;
	parentUpdateFn:	(e: Exp) => Exp;
	globalUpdateFn: () => void;
};

interface State
{
	thisExpRoot: 	Exp;
	selected: 		string;
};

export type OptionCbType = { [index: string]: () => Exp };

const dropDownCbs =
{
	[UNDEF]:	() => { lg("Dropdown select: ", UNDEF); return UNDEF_EXP; },
	[TRUE]: 	() => { lg("Dropdown select: ", TRUE); return TRUE_EXP; },
	[FALSE]: 	() => { lg("Dropdown select: ", FALSE); return FALSE_EXP; },
	[NOT_OP]: 	() => { lg("Dropdown select: ", NOT_OP); return new NotExp(); },
	[AND_OP]:	() => { lg("Dropdown select: ", AND_OP); return new BinExp(AND_OP); },
	[OR_OP]:	() => { lg("Dropdown select: ", OR_OP); return new BinExp(OR_OP); },
	[NAND_OP]: 	() => { lg("Dropdown select: ", NAND_OP); return new BinExp(NAND_OP); },
	[NOR_OP]: 	() => { lg("Dropdown select: ", NOR_OP); return new BinExp(NOR_OP); },
	[XOR_OP]: () => { lg("Dropdown select: ", 	XOR_OP); return new BinExp(OR_OP); }
} as OptionCbType;

// Recursively instantiated React class. 
// Expresssions with sub-expressions recursively use ExpView (within an outer ExpView).
export class ExpView extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.state =
		{
			thisExpRoot = 	props.exp;
			selected =		
		}
	}

	handleDropDownUpdate = (value: string) =>
	{
		const newRoot = this.props.parentUpdateFn( dropDownCbs[value]() );

		lg("Dropdown Select Exp Now: ", newRoot.expand())

		// const newState = new State(newRoot, value);

		let newState: State = this.state;
		this.setState(newState);
		this.props.globalUpdateFn();
	}

	render()
	{
		// What I don't like about this:
		// - the "instanceof" checks and enclosing "if" expressions being the way they are.
		// - an array (indexed by Type) of render-returning functions would be more easily extensible.
		// - would be more elegant.

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
			const notExp = this.props.exp;
		
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
			// as has been pointed out to me (previously there was a downcast here - we can assume that 
			// Typescript knows this is a BinExp, not just an Exp.
			const binExp = this.props.exp;

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
