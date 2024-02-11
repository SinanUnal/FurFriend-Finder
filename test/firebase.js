const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "your-project-id",
    clientEmail: "your-firebase-adminsdk-email@your-project-id.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
  })
});

// Test creating a user
admin.auth().createUser({
  email: "user1",
  password: "User1@"
})
.then(userRecord => console.log('Successfully created new user:', userRecord.uid))
.catch(error => console.error('Error creating new user:', error));
