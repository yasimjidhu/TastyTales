const sendPushNotifications = async (expoToken, title, body) => {
  if (!expoToken) {
    console.warn("❌ No Expo token provided.");
    return;
  }

  const message = {
    to: expoToken,
    sound: 'default',
    title,
    body,
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    console.log('✅ Push notification response:', data);
    return data;
  } catch (err) {
    console.error('❌ Failed to send push notification:', err);
  }
};

module.exports = {
    sendPushNotifications
}