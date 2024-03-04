export const sortData = (
	data: { launch_date_local: string }[],
	type: 'asc' | 'desc'
  ): { launch_date_local: string }[] => {
	// Create a shallow copy of the input array
	const dataCopy = [...data];

	// Sort the copy of the array
	const sortedData = dataCopy.sort((a, b) => {
	  const dateA = new Date(a.launch_date_local);
	  const dateB = new Date(b.launch_date_local);
	  if (type === 'asc') {
		return dateA.getTime() - dateB.getTime();
	  } else {
		return dateB.getTime() - dateA.getTime();
	  }
	});

	return sortedData;
  };
