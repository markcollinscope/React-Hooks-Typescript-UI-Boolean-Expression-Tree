import * as React from 'react';

interface Props
{	
	onSelect:	(v: string) => void;
	options:	string[];
	selected:	string;
}

export function ConstExpView(props: Props)
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
				className={'option-txt'}
				key={k}
				value={k}
			> 
				{s} 
			</option>
		);
	}

	return (
		<select className='option-txt'
			size={1} 
			onChange={handleSelect}
			value={selectedItem}
		>
			{ optionNames.map(createOption) }
		</select>
	);
}
