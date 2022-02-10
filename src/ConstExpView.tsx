// visuals for TRUE, FALSE and UNDEF.

import * as React from 'react';

interface Props
{	
	onSelect:	(s: string) => void;
	options:	string[];
	selected:	string;
}

export function ConstExpView(props: Props)
{
	const optionNames = props.options;
	const selectedItem = optionNames.indexOf(props.selected);
	
	// naughty ... (the 'any' here - forgive me!)
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
				className={'option-txt md-font'}
				key={k}
				value={k}
			> 
				{s} 
			</option>
		);
	}

	return (
		<select className='option-txt md-font'
			size={1} 
			onChange={handleSelect}
			value={selectedItem}
		>
			{ optionNames.map(createOption) }
		</select>
	);
}
