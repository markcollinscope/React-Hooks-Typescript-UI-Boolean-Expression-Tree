// React Component: ExpView. 

// visual representation of boolean expressions - done in such a way as to enable 
// the dynamic construction of complex nested expressions (and, or, not ...), 
// to an arbitrary depth, including allowing undefined elements and the use of boolean constants.

// provides the UI side of Exp.ts - recursively displaying and enabling the modification 
// at any point in the expressions hierarchy.
import React from 'react';
import { ConstExpView } from './ConstExpView';

// boolean expressions - types(classes) and constants.
// as this list has grown, "import * as exp from './Exp'" might be a better option...
import { 
	Exp, BinExp, NotExp, AndExp, OrExp, NandExp, NorExp, XorExp, XOR_OP, NAND_OP, NOR_OP, UNDEF_EXP, TRUE_EXP, 
	FALSE_EXP, NOT_OP, AND_OP, OR_OP, UNDEF, TRUE, FALSE
} from './Exp';

interface Props
{
	exp:	Exp;	// Exp being shown in 'this' instance of ExpView.
	
	// discussion: when this.props.Exp is updated, this has to be done in the context of the parent Exp, as the parent holds a ref to
	// the expression passed into Props and shown in the ExpView. Changing the Exp locally to a new Exp, would have no permanent effect.
	// The parent Exp would still hold a reference to the original Exp passed into this component on construction. 
	// parentUpdateCb (a callback)  is *one* approach to doing this. There are others... (suggests welcomed...)
	parentUpdateCb:	(e: Exp) => Exp;
	
	// discussion (see function below): this callback is not nice, however there's an issue that React does not do deep comparisons on State 
	// changes - when it is trying to fathom what is has to redraw (render) on the UI. 
	// React certainly won't recurse it's way down a indeterminate (and flexible) number of subExps to see if something has changed deep down.
	// so consider: perhaps the Exp passed in as props.exp is a sub-sub-sub-sub-sub-Exp node - as is quite possible if one wants
	// as necessary when there is an a arbitrary level of boolean expressions (without UX restricting limites like: 'you can only have two sub-expression levels').
	// so: the pursose of this callback is to request that the top level App (or whatever component holds the Exp root) re-evaluate 
	// the boolean result of Exp tree (e.g. "and (or TRUE FALSE) (nor (not FALSE), (not TRUE))" 
	requestAppStateBeUpdatedCb: () => void;
};

// discussion: why is 'thisExpRoot' held in State (below)? Can't it just be accessed from Props - where it is passed during contruction?
// That approach could be adopted, in which case the 'ComponentWillUpdateProps' React lifecycle method would be defined within ExpView.
// Given no wider context in which to make the decision, either would do here - though use of ComponentWillUpdate props might be considered
// a more 'natural React' way of doing it. I could be persuaded of that.
interface State
{
	thisExpRoot: 	Exp;
	selected: 		string;
};

export type ExpFactoryCb = { [index: string]: () => Exp };

// nb: design objective: ease of extension of UI options for types of Exp (and, or ...) that can be created and used.
//
// this array of functions corresponds to the options that can be chosen from any Exp node on the UI.
// uses:
// *key*: the option shown and requested in the drop-down menu.
// *value*: the factory function to create the appropriate type of Exp object (TRUE, nand, not ..., etc)
//
// this approach it is extremely flexible and trivially extended, to add new 'option' types and new 'Exp (object) types'.
// no other change is required to extend the available drop-down menu options on the UI. see the Factory pattern, which this is
// a variation of (it's a factory function rather than a factory object...)
const dropDownMenuExpFactor =
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

// recursively instantiated React class.
// expresssions with sub-expressions recursively use ExpView (for sub-expressions) within (i.e. visually and functionally) 
// the context of this ExpView.
//
// nb: something that perhaps makes this different from an 'average' React Component is that it is manipulating (problem) domain
// items that an inherently recursive in nature... Hence it is, itself, recursive.
export class ExpView extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.state =
		{
			thisExpRoot: 	props.exp,
			selected:		props.exp.name()
		}
	}

	// callback passed to action the selection of an item in the expression item drop-downs.
	handleSelectionFromDropDownMenu = (value: string) =>
	{
		const newRoot = this.props.parentUpdateCb( dropDownMenuExpFactor[value]() );

		let newState = this.state as State;
		newState.thisExpRoot = newRoot;
		this.setState(newState);
		
		// i don't like having to use this fn so much... ongoing...
		this.props.requestAppStateBeUpdatedCb();
	}

	render()
	{
		// What I don't like about this:
		// - the "instanceof" checks and enclosing "if" expressions being the way they are.
		// - an array (indexed by Exp Type) of render-returning functions would be more easily extensible.
		// - and would be more elegant.

		// basic case - UNDEF, TRUE or FALSE value.
		let viewToRender = 
			<div className='bdr md-font exp-width'>
			<ConstExpView 
				options={ Object.keys(dropDownMenuExpFactor) }
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
			// as has been pointed out to me (previously there was a downcast here - we can assume that 
			// Typescript knows this is a BinExp, not just an Exp.
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
