const defaultPrimary = "#B50900"
const defaultSecondary = "#8f0700"
const defaultSuccess = "#86AD34"
const defaultError = "#f50c00"

export const lightTheme = {
	name: 'light',

	primary: defaultPrimary,
	secondary: defaultSecondary,
	accent: "#ef4c2d",

	background: 'transparent',
	componentBackground: '#fff',
	componentPressed: '#ccc',

	textPrimary: '#000',
	textPrimaryContrast: '#fff',
	textSecondary: '#505050',
	textHint: '#aaa',

	success: defaultSuccess,
	error: defaultError
}

export const darkTheme = {
	name: 'dark',

	primary: defaultError,
	secondary: defaultSecondary,
	accent: "#ef4c2d",

	background: '#000',
	componentBackground: '#222',
	componentPressed: '#666',

	textPrimary: '#fff',
	textPrimaryContrast: '#fff',
	textSecondary: '#ccc',
	textHint: '#aaa',

	success: defaultSuccess,
	error: defaultError
}

export const ConstantColors = {
	grey: "#aaa",
	lightgrey: "#ccc",
	transparent: 'transparent',
	white: '#fff',
}
