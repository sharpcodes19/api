import { fetchAsync } from '../api'

// prettier-ignore
export type ExpoPushNotificationResponse = {
  id: string
} & 
(
  { status: 'ok' } |
  {
    status: 'error'
    message: string
    details: any
  }
)

export type ExpoPushNotificationPayload<T = unknown> = {
	to: Array<string>
	data: T
	title: string
	body: string
	expiration?: number
	ttl?: number
	priority?: 'default' | 'normal' | 'high'
	subtitle?: string
	sound?: 'default' | null
	badge?: number
	channelId?: string
	mutableContent?: boolean
}

export const sendPushNotification = <T, R extends ExpoPushNotificationResponse>(
	payload: ExpoPushNotificationPayload<T>
) => {
	fetchAsync<R>('https://exp.host/--/api/v2/push/send', {
		headers: {
			'content-type': 'application/json',
			'accept-encoding': 'gzip, deflate',
			accept: 'application/json',
			host: 'exp.host',
		},
		body: JSON.stringify(payload),
	})
}
