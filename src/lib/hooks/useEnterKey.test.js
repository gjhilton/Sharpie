import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEnterKey } from './useEnterKey.js';

describe('useEnterKey', () => {
	it('calls callback when Enter key is pressed', () => {
		const callback = vi.fn();
		renderHook(() => useEnterKey(callback));

		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		window.dispatchEvent(event);

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('does not call callback for other keys', () => {
		const callback = vi.fn();
		renderHook(() => useEnterKey(callback));

		const event = new KeyboardEvent('keydown', { key: 'Space' });
		window.dispatchEvent(event);

		expect(callback).not.toHaveBeenCalled();
	});

	it('removes event listener on unmount', () => {
		const callback = vi.fn();
		const { unmount } = renderHook(() => useEnterKey(callback));

		unmount();

		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		window.dispatchEvent(event);

		expect(callback).not.toHaveBeenCalled();
	});

	it('updates callback when it changes', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		const { rerender } = renderHook(({ cb }) => useEnterKey(cb), {
			initialProps: { cb: callback1 },
		});

		const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
		window.dispatchEvent(event1);
		expect(callback1).toHaveBeenCalledTimes(1);

		rerender({ cb: callback2 });

		const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
		window.dispatchEvent(event2);
		expect(callback2).toHaveBeenCalledTimes(1);
		expect(callback1).toHaveBeenCalledTimes(1);
	});
});
