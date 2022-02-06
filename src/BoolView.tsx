import * as React from 'react';

// import { Exp } from './Exp';

export type OptionCbs = {[index: string]: (s: string) => void};

interface Props
{	
	optionCbs:	OptionCbs;
}

export function BoolView(props: Props)
{

	const optionNames = Object.keys(props.optionCbs);
	
	// naughty ... (any)
	const handleSelect = (event: any): void =>
	{
		event.preventDefault();
		let value = parseInt(event.target.value) as number;

		const optionChosen = optionNames[value];
		props.optionCbs[optionChosen](optionChosen);
	}

	const createOption = (s: string, k: number) =>
	{
		return (
			<option 
				//
				className={'optiontxt'}
				key={k}
				value={k}
			> 
				{s} 
			</option>
		);
	}

	return (
		<select className='optiontxt'
			size={1} 
			onChange={handleSelect}
		>
			{ optionNames.map(createOption) }
		</select>
	);
}
