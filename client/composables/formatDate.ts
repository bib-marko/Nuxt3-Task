export const formatDate = (value: any) => {
	const date = new Date(value);
	const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
	return formattedDate
}
