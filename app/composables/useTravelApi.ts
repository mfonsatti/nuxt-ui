export const useTravelApi = () => {
	const config = useRuntimeConfig();
	return useFetch(`${config.public.apiBaseUrl}/travels`);
};
