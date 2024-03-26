import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export const cn = (...classNames: Array<ClassValue>) =>
	twMerge(clsx(classNames))

export const generateUniqueId = () => {
	// Modeled after base64 web-safe chars, but ordered by ASCII.
	const PUSH_CHARS =
		'-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'

	// Timestamp of last push, used to prevent local collisions if you push twice in one ms.
	let lastPushTime = 0

	// We generate 72-bits of randomness which get turned into 12 characters and appended to the
	// timestamp to prevent collisions with other clients.  We store the last characters we
	// generated because in the event of a collision, we'll use those same characters except
	// "incremented" by one.
	const lastRandChars: Array<number> = []
	let now = new Date().getTime()
	const duplicateTime = now === lastPushTime
	lastPushTime = now

	const timeStampChars = new Array(8)
	for (var i = 7; i >= 0; i--) {
		timeStampChars[i] = PUSH_CHARS.charAt(now % 64)
		// NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
		now = Math.floor(now / 64)
	}
	if (now !== 0)
		throw new Error('We should have converted the entire timestamp.')

	let id = timeStampChars.join('')

	if (!duplicateTime) {
		for (i = 0; i < 12; i++) {
			lastRandChars[i] = Math.floor(Math.random() * 64)
		}
	} else {
		// If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
		for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
			lastRandChars[i] = 0
		}
		lastRandChars[i]++
	}
	for (i = 0; i < 12; i++) {
		id += PUSH_CHARS.charAt(lastRandChars[i])
	}
	if (id.length !== 20) throw new Error('Length should be 20.')
	return id
}
