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
				baseline: { value: 'lightblue' },
				link: { value: 'red' },
				toggleActive: { value: 'red' },
				paper: { value: 'white' },
				popover: { value: '#333' },
				border: { value: '#ccc' },
				borderFocus: { value: '#333' },
				borderHover: { value: '#999' },
				toggleInactive: { value: '#E5E5EA' },
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
			},
		},
	},

	// The output directory for your css system
	outdir: 'styled-system',
});
