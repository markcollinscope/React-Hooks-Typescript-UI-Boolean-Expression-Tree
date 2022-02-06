import * as React from 'react';

// import { Exp } from './Exp';

interface Props
{	
	optionNames:	string[] 
	onSelect:		(n: number) => void;
}

export function BoolView(props: Props)
{
	// naughty ... (any)
	const handleSelect = (event: any): void =>
	{
		event.preventDefault();
		let value = parseInt(event.target.value) as number;

		props.onSelect(value);
	}

	const createOption = (s: string, k: number) =>
	{
		return (
			<option 
				//
				className={'optionTxt'}
				key={k}
				value={k}
			> 
				{s} 
			</option>
		);
	}

	return (
		<select className='optionTxt'
			size={1} 
			onChange={handleSelect}
		>
			{ props.optionNames.map(createOption) }
		</select>
	);
}
