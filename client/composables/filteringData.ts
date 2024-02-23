export const filteringData = (data: any, value: any) => {
	const matchingObjects = data.filter((obj: any) => obj.launch_date_local.startsWith(value));
	return matchingObjects
}
