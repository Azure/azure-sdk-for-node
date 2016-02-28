
Notification hubs allow you to send notifications to WNS, APNS, GCM, and MPNS receivers.

To create a notification hub, use the method **createNotificationHub**.

```JavaScript
var serviceBusService = azure.createServiceBusService();

serviceBusService.createNotificationHub('hubName', function (err) {
  if (!err) {
    // Notification hub created successfully
  }
});
```

To send notification using native format to the notification hub use the methods of the **wns**, **apns**, **gcm**, **mpns** objects. For a full reference on WNS method templates, check http://msdn.microsoft.com/en-us/library/windows/apps/hh779725.aspx.
To send template (cross-platform) notifications use the send method on the **NotificationHubService** class.

```JavaScript
var notificationHubService = azure.createNotificationHubService('hubName');

// WNS notification
notificationHubService.wns.sendTileSquarePeekImageAndText01(
  null,
  {
    image1src: 'http://foobar.com/dog.jpg',
    image1alt: 'A dog',
    text1: 'This is a dog',
    text2: 'The dog is nice',
    text3: 'The dog bites',
    text4: 'Beware of dog'
  },
  function (error) {
    if (!error) {
      // message sent successfully
    }
  });

// APNS notification
notificationHubService.apns.send(
  null,
  {
    alert: 'This is my toast message for iOS!',
    expiry: expiryDate
  },
  function (error) {
    if (!error) {
      // message sent successfully
    }
  });

// GCM notification
notificationHubService.gcm.send(
  null,
  {
    data: { message: 'Here is a message' }
  },
  function (error) {
    if (!error) {
      //message send successfully
    }
  });

// MPNS notification
notificationHubService.mpns.sendToast(
  null,
  {
    text1: 'A dog',
    text2: 'This is a dog'
  },
  function (error) {
    if (!error) {
      //message send successfully
    }
  });

// template notification
notificationHubService.send(
  null,
  {
    message: 'This is my template notification',
    goesTo: 'all registrations irrespective of the platform'
  },
  function (error) {
    if (!error) {
      //message send successfully
    }
  });

```

To create registrations (for both native and template notifications), use the creation methods in the **wns**, **apns**, **gcm**, **mpns**. To retrieve, update and delete existing registrations, use the following methods in NotificationHubService: **getRegistration**, **listRegistrations**, **listRegistrationsByTag**, **updateRegistration**, and **deleteRegistration**.
