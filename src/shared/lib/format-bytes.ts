type Units = [string, string, string, string]
const defaultUnits: Units = ['КБ', 'МБ', 'ГБ', 'ТБ']
const formatter = new Intl.NumberFormat('ru-RU', {
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
})

export function formatBytes(bytes: number, units: Units = defaultUnits) {
	if (bytes < 1024)
		return `< 1 ${units[0]}`

	const k = 1024
	let size = bytes
	let unitIndex = -1

	while (size >= k && unitIndex < units.length - 1) {
		size /= k
		unitIndex++
	}

	return `${formatter.format(size)} ${units[unitIndex]}`
}
