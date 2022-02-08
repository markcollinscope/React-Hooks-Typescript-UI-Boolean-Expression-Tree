import * as React from 'react';

import { Exp } from './Exp';

interface Props
{	
	onSelect:	(v: string) => void;
	options:	string[];
	selected:	string;
}

export function BoolView(props: Props)
{
	const optionNames = props.options;
	const selectedItem = optionNames.indexOf(props.selected);
	
	// naughty ... (the 'any' - forgive me!)
	const handleSelect = (event: any): void =>
	{
		event.preventDefault();
		let value = parseInt(event.target.value) as number;

		const optionChosen = optionNames[value];
		props.onSelect(optionChosen);
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
			value={selectedItem}
		>
			{ optionNames.map(createOption) }
		</select>
	);
}
