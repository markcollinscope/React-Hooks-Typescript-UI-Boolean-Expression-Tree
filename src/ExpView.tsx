import React from 'react';

import { lg } from './utils'

import { Exp, BinExp, NotExp, undefExp, trueExp, falseExp, UNI, LHS, RHS } from './Exp';
export * from './Exp';

interface Props
{
	onUpdate: (result: boolean, expansion: string) => void;
	exp: Exp;
};

class State
{
	constructor(public rootExp: Exp, public canRender: boolean) {}
};

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

		const rootExp = this.state.rootExp;
		const rootExpTypeName = rootExp.name();

		const isUniExp = rootExp instanceof NotExp;
		const isBinExp = rootExp instanceof BinExp;
		
		lg("Root: ", rootExpTypeName)
	
		let expReturn = <p className='bdr stdfont expwidth'>{rootExpTypeName}</p>

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
