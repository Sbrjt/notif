import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { Button, View } from 'react-native'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true
	})
})

export default function App() {
	useEffect(() => {
		const setupNotifications = async () => {
			await Notifications.requestPermissionsAsync()

			// Set up the notification category with a text input action
			await Notifications.setNotificationCategoryAsync('notify1', [
				{
					buttonTitle: 'Add text',
					identifier: 'input',
					textInput: {
						submitButtonTitle: 'Submit',
						placeholder: 'Enter text...'
					},
					options: {
						opensAppToForeground: false
					}
				}
			])
		}

		setupNotifications()

		// Listen for notification responses
		const subscription = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				if (response.actionIdentifier === 'input') {
					console.log(response)
					console.log(response.userText)
				}
			}
		)

		return () => subscription.remove()
	}, [])

	// Function to trigger a notification with a text input action
	const triggerNotification = async () => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: 'Input Required',
				body: 'Please add some text',
				categoryIdentifier: 'notify1'
			},
			trigger: null
		})
	}

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Button title='Trigger Notification' onPress={triggerNotification} />
		</View>
	)
}
