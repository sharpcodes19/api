type GroupedData<T> = {
	[key: string]: T[]
}

export const groupBy = <T>(arr: T[], property: keyof T): GroupedData<T> => {
	return arr.reduce((result: GroupedData<T>, obj: T) => {
		const key = String(obj[property])
		if (!result[key]) {
			result[key] = []
		}
		result[key].push(obj)
		return result
	}, {})
}
