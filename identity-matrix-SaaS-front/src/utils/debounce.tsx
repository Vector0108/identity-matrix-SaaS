export const debounce = <T extends (...args: any[]) => any>(
	func: T
): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout> | null;

	return function debouncedFn(this: any, ...args: Parameters<T>) {
		const context = this;

		if (timer) clearTimeout(timer);

		timer = setTimeout(() => {
			timer = null;
			func.apply(context, args);
		}, 500);
	};
};
