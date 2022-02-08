import React from 'react';

import { lg } from './utils'
// basic case - UNDEF, TRUE or FALSE value.

import { Exp, BinExp, NotExp, undefExp, trueExp, falseExp, LHS, RHS, NOT, AND, OR, UNDEF, TRUE, FALSE } from './Exp';
import { BoolView } from './BoolView';

interface Props
{
	exp: Exp;
	parentUpdateFn:	(e: Exp) => Exp;
	globalUpdateFn: () => void;
};

class State
{
	constructor(public thisExpRoot: Exp, public selected: string, public canRender: boolean) {}	// check canRender - TODO
};

export type OptionCbType = {[index: string]: () => Exp};

const dropDownCbs =
{
	UNDEF:	() => { lg("Dropdown select: ",UNDEF); return undefExp; },
	TRUE: 	() => { lg("Dropdown select: ", TRUE); return trueExp; },
	FALSE: 	() => { lg("Dropdown select: ", FALSE); return falseExp; },
	AND:	() => { lg("Dropdown select: ", AND); return new BinExp(AND); },
	OR:		() => { lg("Dropdown select: ", OR); return new BinExp(OR); },
	NOT:	() => { lg("Dropdown select: ", NOT); return new NotExp(); }
} as OptionCbType;

// Recursively instantiated React class. Exp sub-expressions use ExpView within ExpView, etc.
export class ExpView extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.state = new State(props.exp, props.exp.name(), true);
	}

	handleDropDownUpdate = (value: string) =>
	{
		const newRoot = this.props.parentUpdateFn( dropDownCbs[value]() );

		lg("Dropdown Select Exp Now: ", newRoot.expand())

		const newState = new State(newRoot, value, true);
		this.setState(newState);
		this.props.globalUpdateFn();
	}

	render()
	{
		if (!this.state.canRender) return <p>Loading...</p>

		// basic case - UNDEF, TRUE or FALSE value.
		let expReturn = 
			<div className='bdr stdfont expwidth'>
			<BoolView 
				options={ Object.keys(dropDownCbs) }
				onSelect={ this.handleDropDownUpdate }
				selected={ this.props.exp.name() }
			/>
			</div>


		if (this.props.exp instanceof NotExp)
		{
			const notExp = this.props.exp as NotExp // downcast to subclass.
		
			expReturn = 
				<div className='flex-horiz'>
					{expReturn}
					<div className='vgap'/>
					<ExpView
						exp={notExp.getsubexp()}
						parentUpdateFn={notExp.setsubexp}
						globalUpdateFn={this.props.globalUpdateFn}						
					/>
				</div>
		}
	
		if (this.props.exp instanceof BinExp)
		{
			const binExp = this.props.exp as BinExp;

			expReturn = 
				<div>
					{expReturn}
					<div className='vgap'/>
					<div className='lhsmargin'>
						<ExpView
							exp={binExp.getlhsexp()}
							parentUpdateFn={binExp.setlhsexp}
							globalUpdateFn={this.props.globalUpdateFn}
						/>
					</div>
					<div className='vgap'/>
					<div className='lhsmargin'>
						<ExpView 
							exp={binExp.getrhsexp()}
							parentUpdateFn={binExp.setrhsexp}
							globalUpdateFn={this.props.globalUpdateFn}
						/>
					</div>
				</div>
		}
		
		return expReturn;
	}
}

// if (thisExpRoot instanceof BinExp) //TODO
		// {
		// 	isBinOptExp = true;
		// 	lg('bin exp')
		// }
		// else if (thisExpRoot instanceof NotExp) //TODO
		// {
		// 	isUniOpExp = true;
		// 	lg('uni exp')
		// }
		// else
		// {
		// 	lg('const')
		// }

		// if ( [undefExp.name(), trueExp.name(), falseExp.name()].includes(thisExpRootTypeName) )
		// {
		// 	expTxt = thisExpRootTypeName

		// 	lg('const')
		// }
		// else if (thisExpRootTypeName === new NotExp().name()) //TODO
		// {
		// 	expTxt = thisExpRootTypeName
		// 	isUniOpExp = true;

		// 	lg('uni exp')
		// }
		// else if ( []
