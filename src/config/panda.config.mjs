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
				spacing: {
					tiny: { value: '0.125rem' }, // 2px
					xs: { value: '0.25rem' }, // 4px
					sm: { value: '0.5rem' }, // 8px
					md: { value: '0.75rem' }, // 12px
					lg: { value: '1rem' }, // 16px - base unit
					xl: { value: '1.25rem' }, // 20px
					'2xl': { value: '1.5rem' }, // 24px
					'3xl': { value: '2rem' }, // 32px
					'4xl': { value: '3rem' }, // 48px
					'5xl': { value: '4rem' }, // 64px
				},
				borderWidths: {
					thin: { value: '1px' },
					medium: { value: '2px' },
					thick: { value: '3px' },
					heavy: { value: '4px' },
				},
				radii: {
					sm: { value: '4px' },
					md: { value: '8px' },
					lg: { value: '16px' },
					full: { value: '9999px' },
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
	outdir: 'dist/styled-system',
});
