import React from 'react';

import { lg } from './utils'

import { Exp, BinExp, NotExp, undefExp, trueExp, falseExp, UNI, LHS, RHS, AND } from './Exp';
import { BoolView, OptionCbs } from './BoolView';

export * from './Exp';	// TODO Redact.

const tstFn = (s: string): void  => { lg("Menu: ", s) }

interface Props
{
	onUpdate: (result: boolean, expansion: string) => void;
	exp: Exp;
};

class State
{
	constructor(public rootExp: Exp, public canRender: boolean) {}	// check canRender - TODO
};

const dropDownCbs =
{
	"undef":	(s: string) => { lg(s); return undefExp; },
	"true": 	(s: string) => { lg(s); return trueExp; },
	"false": 	(s: string) => { lg(s); return falseExp; },
	"and":		(s: string) => { lg(s); return new BinExp(AND); }
};

/* HERE! HERE! TODO
	rootExp - parent of current expression to be shown - for App - this is 'dummy parent',
	to enable the App root Exp to be modified.
    
    (App)     (type and dropdown)
    dummyExp ---> xxxExp --------------------> xxxExp ... etc.
                    |------------------------> exxExp ... etc.     
	
	selecting a new option (from the dropdown menu on all Exp nodes) changes
	
*/

export class ExpView extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.state = new State(props.exp, true);
	}

	render()
	{
		if (!this.state.canRender) return <p>Loading...</p>

		const isUniExp = this.props.exp instanceof NotExp;
		const isBinExp = this.props.exp instanceof BinExp;
		
		let expReturn = 
			<div className='bdr stdfont expwidth'>
			<BoolView 
				optionCbs={ dropDownCbs }
			/>
			</div>
		
		// let expReturn = <p className='bdr stdfont expwidth'>{rootExpTypeName}</p> TODO.

		if (isUniExp)
		{
			expReturn = 
				<div className='flex-horiz'>
					{expReturn}
					<div className='vgap'/>
					<ExpView
						exp={this.props.exp.sub(UNI)}
						onUpdate={this.props.onUpdate}
					/>
				</div>
		}
	
		if (isBinExp)
		{
			expReturn = 
				<div>
					{expReturn}
					<div className='vgap'/>
					<div className='lhsmargin'>
						<ExpView
							exp={this.props.exp.sub(LHS)}
							onUpdate={this.props.onUpdate}
						/>
					</div>
					<div className='vgap'/>
					<div className='lhsmargin'>
						<ExpView 
							exp={this.props.exp.sub(RHS)}
							onUpdate={this.props.onUpdate}
						/>
					</div>
				</div>
		}
		
		return expReturn;
	}
}

// if (rootExp instanceof BinExp) //TODO
		// {
		// 	isBinExp = true;
		// 	lg('bin exp')
		// }
		// else if (rootExp instanceof NotExp) //TODO
		// {
		// 	isUniExp = true;
		// 	lg('uni exp')
		// }
		// else
		// {
		// 	lg('const')
		// }

		// if ( [undefExp.name(), trueExp.name(), falseExp.name()].includes(rootExpTypeName) )
		// {
		// 	expTxt = rootExpTypeName

		// 	lg('const')
		// }
		// else if (rootExpTypeName === new NotExp().name()) //TODO
		// {
		// 	expTxt = rootExpTypeName
		// 	isUniExp = true;

		// 	lg('uni exp')
		// }
		// else if ( []
