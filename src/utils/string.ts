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

export const hexToRGBAColor = (hex: string, alpha?: number) => {
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		let c = hex.substring(1).split('')
		if (c.length == 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]]
		}
		const rgba: any = '0x' + c.join('')
		return (
			'rgba(' +
			[(rgba >> 16) & 255, (rgba >> 8) & 255, rgba & 255].join(',') +
			`,${alpha ?? 1})`
		)
	}
	throw new Error('Bad Hex')
}
