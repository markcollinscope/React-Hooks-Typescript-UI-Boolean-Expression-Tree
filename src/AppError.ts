// more infrastructure ...

export class AppError extends Error
{
	constructor(message: string = "basic application programming error") 
	{
		super(message);
	}
}
