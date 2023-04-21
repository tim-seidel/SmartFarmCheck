//Credit: https://stackoverflow.com/a/57888548/9247401
export const fetchWithTimeout = (url, ms, { signal, ...options } = {}) => {
	const controller = new AbortController();

	const promise = fetch(url, { signal: controller.signal, ...options });
	if (signal) signal.addEventListener("abort", () => controller.abort());
	const timeout = setTimeout(() => controller.abort(), ms);

	return promise.finally(() => clearTimeout(timeout));
};