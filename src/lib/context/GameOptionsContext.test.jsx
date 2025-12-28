import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
	GameOptionsProvider,
	useGameOptionsContext,
} from './GameOptionsContext';

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockSearch = {};
vi.mock('@tanstack/react-router', () => ({
	useSearch: () => mockSearch,
	useNavigate: () => mockNavigate,
}));

// Mock options module
vi.mock('@lib/options/index.js', () => {
	const mockOptions = {
		mode: {
			key: 'mode',
			type: 'enum',
			urlParam: 'm',
			default: 'all',
		},
		showBaseline: {
			key: 'showBaseline',
			type: 'boolean',
			urlParam: 'b',
			default: true,
		},
		numLetters: {
			key: 'numLetters',
			type: 'boolean',
			urlParam: 'l',
			default: true,
		},
	};

	return {
		OPTIONS: mockOptions,
		getOptionByKey: key => {
			return Object.values(mockOptions).find(opt => opt.key === key);
		},
		deserializeOptions: search => ({
			mode:
				search.m === 'i'
					? 'minuscule'
					: search.m === 'j'
						? 'majuscule'
						: 'all',
			enabledHands: { 'BeauChesne-Baildon': true, Hill: true },
			numLetters: search.l !== 'f',
			showBaseline: search.b !== 'f',
		}),
		serializeOption: (key, value) => {
			const serialized = {};
			if (key === 'mode') {
				serialized.m =
					value === 'minuscule'
						? 'i'
						: value === 'majuscule'
							? 'j'
							: 'a';
			} else if (key === 'numLetters') {
				serialized.l = value ? 't' : 'f';
			} else if (key === 'showBaseline') {
				serialized.b = value ? 't' : 'f';
			}
			return serialized;
		},
	};
});

describe('GameOptionsContext', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.keys(mockSearch).forEach(key => delete mockSearch[key]);
	});

	describe('Provider and Hook', () => {
		it('should provide context to children', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current).toBeDefined();
			expect(result.current.options).toBeDefined();
			expect(result.current.updateOption).toBeDefined();
			expect(result.current.toggleOption).toBeDefined();
			expect(result.current.cycleMode).toBeDefined();
			expect(result.current.resetOptions).toBeDefined();
		});

		it('should throw error when used outside provider', () => {
			// Suppress console.error for this test
			const consoleSpy = vi
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			expect(() => {
				renderHook(() => useGameOptionsContext());
			}).toThrow(
				'useGameOptionsContext must be used within GameOptionsProvider'
			);

			consoleSpy.mockRestore();
		});
	});

	describe('Options', () => {
		it('should provide default options', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.mode).toBe('all');
			expect(result.current.options.numLetters).toBe(true);
			expect(result.current.options.showBaseline).toBe(true);
			expect(result.current.options.enabledHands).toBeDefined();
		});

		it('should deserialize options from URL search params', () => {
			mockSearch.m = 'i';
			mockSearch.l = 'f';
			mockSearch.b = 'f';

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.mode).toBe('minuscule');
			expect(result.current.options.numLetters).toBe(false);
			expect(result.current.options.showBaseline).toBe(false);
		});
	});

	describe('updateOption', () => {
		it('should call navigate with serialized option', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			act(() => {
				result.current.updateOption('mode', 'minuscule');
			});

			expect(mockNavigate).toHaveBeenCalledWith({
				search: expect.any(Function),
				replace: true,
			});

			// Test the search function
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({ existing: 'param' });
			expect(newSearch).toEqual({ existing: 'param', m: 'i' });
		});

		it('should update boolean options', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			act(() => {
				result.current.updateOption('showBaseline', false);
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ b: 'f' });
		});
	});

	describe('toggleOption', () => {
		it('should toggle boolean option from true to false', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			// Initially true
			expect(result.current.options.showBaseline).toBe(true);

			act(() => {
				result.current.toggleOption('showBaseline');
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ b: 'f' });
		});

		it('should toggle boolean option from false to true', () => {
			mockSearch.b = 'f'; // Start with false

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.showBaseline).toBe(false);

			act(() => {
				result.current.toggleOption('showBaseline');
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ b: 't' });
		});

		it('should toggle numLetters option', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.numLetters).toBe(true);

			act(() => {
				result.current.toggleOption('numLetters');
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ l: 'f' });
		});

		it('should warn and not toggle non-boolean options', () => {
			const consoleSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {});

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			act(() => {
				result.current.toggleOption('mode');
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'toggleOption called on non-boolean option: mode'
			);
			expect(mockNavigate).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('should warn and not toggle enabledHands', () => {
			const consoleSpy = vi
				.spyOn(console, 'warn')
				.mockImplementation(() => {});

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			act(() => {
				result.current.toggleOption('enabledHands');
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'toggleOption called on non-boolean option: enabledHands'
			);
			expect(mockNavigate).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe('cycleMode', () => {
		it('should cycle from minuscule to majuscule', () => {
			mockSearch.m = 'i';

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.mode).toBe('minuscule');

			act(() => {
				result.current.cycleMode();
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ m: 'j' });
		});

		it('should cycle from majuscule to all', () => {
			mockSearch.m = 'j';

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.mode).toBe('majuscule');

			act(() => {
				result.current.cycleMode();
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ m: 'a' });
		});

		it('should cycle from all to minuscule', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			expect(result.current.options.mode).toBe('all');

			act(() => {
				result.current.cycleMode();
			});

			expect(mockNavigate).toHaveBeenCalled();
			const searchFn = mockNavigate.mock.calls[0][0].search;
			const newSearch = searchFn({});
			expect(newSearch).toEqual({ m: 'i' });
		});
	});

	describe('resetOptions', () => {
		it('should reset all options to defaults', () => {
			mockSearch.m = 'i';
			mockSearch.l = 'f';
			mockSearch.b = 'f';

			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			act(() => {
				result.current.resetOptions();
			});

			expect(mockNavigate).toHaveBeenCalledWith({
				search: {},
				replace: true,
			});
		});

		it('should call navigate with replace: true', () => {
			const { result } = renderHook(() => useGameOptionsContext(), {
				wrapper: GameOptionsProvider,
			});

			act(() => {
				result.current.resetOptions();
			});

			expect(mockNavigate).toHaveBeenCalledWith(
				expect.objectContaining({
					replace: true,
				})
			);
		});
	});
});
