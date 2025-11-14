import { defineConfig } from '@pandacss/dev';

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {
			breakpoints: {
				desktop: '860px',
			},
			tokens: {
				colors: {
					keyboardHighlight: { value: 'lemonchiffon' },
					error: { value: 'red' },
					ink: { value: 'black' },
					paper: { value: 'white' },
					toggleInactive: { value: '#E5E5EA' },
					primary: { value: '#008cff' },
					baseline: { value: '{colors.primary}' },
					link: { value: '{colors.primary}' },
					toggleActive: { value: '{colors.primary}' },
					borderFocus: { value: '{colors.primary}' },
					borderHover: { value: '{colors.primary}' },
					popover: { value: '{colors.ink}' },
					border: { value: '{colors.ink}' },
				},
				fontSizes: {
					s: { value: '0.875rem' }, // 14px - tips, small UI
					m: { value: '1.25rem' }, // 20px - body, buttons
					l: { value: '1.375rem' }, // 22px - emphasis
					xl: { value: '2rem' }, // 32px - headings, displays
				},
				fonts: {
					joscelyn: { value: 'Joscelyn, serif' },
				},
			},
			keyframes: {
				rotation: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				logoDash: {
					to: { strokeDashoffset: '0' },
				},
			},
		},
	},

	// The output directory for your css system
	outdir: 'styled-system',
});
