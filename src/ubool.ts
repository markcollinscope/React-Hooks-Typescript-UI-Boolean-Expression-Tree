//******

export type uBoolean = true | false | undefined;

const containsUndefined = (l: uBoolean, r: uBoolean) => (l === undefined) || (r === undefined);

export const uNot = (v: uBoolean) => (v === undefined) ? undefined : !v;
export const uAnd = (l: uBoolean, r: uBoolean) => containsUndefined(l, r) ? undefined : l && r;
export const uOr = (l: uBoolean, r: uBoolean) => containsUndefined(l, r) ? undefined : l || r;

export const TRUE = 'True'
export const FALSE = 'False'
export const UNDEF = 'Undefined'

export const uBoolToName = (value: uBoolean ) =>
{
	if (value ===  true ) return TRUE;
	if (value === false) return FALSE;
	return UNDEF;
}
