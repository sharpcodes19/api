export const dataUrlToBlobAsync = (dataUrl: string, isWeb: boolean = false) => {
	return new Promise<Blob>(async (resolve, reject) => {
		const [media, base64] = dataUrl.split(',')
		if (!base64) return reject("Invalid data URL format. Can't extract Base64.")
		if (!media) return reject("Invalid data URL format. Can't media type.")

		const [, type] = media.split(':')
		if (!type) return reject("Invalid data URL format. Can't mime type.")

		try {
			if (isWeb) {
				const byteString = atob(base64)
				const ab = new ArrayBuffer(byteString.length)
				const ia = new Uint8Array(ab)
				for (let i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i)
				}
				return resolve(new Blob([ab], { type }))
			}

			const response = await fetch(dataUrl)
			const blob = await response.blob()
			return resolve(blob)
		} catch (error) {
			reject(error)
		}
	})
}

export const uriToBlobAsync = (uri: string) =>
	new Promise<Blob>((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.onload = () => {
			resolve(xhr.response)
		}
		xhr.onerror = (e) => {
			console.error('Conversion of uri to blob was failed.', e)
			reject(new TypeError('Conversion of uri to blob was failed.'))
		}
		xhr.responseType = 'blob'
		xhr.open('GET', uri, true)
		xhr.send(null)
	})
