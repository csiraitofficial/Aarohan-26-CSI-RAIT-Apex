# Adding Firebase Sync Manually

If the automated Firebase sync integration is failing or throwing permissions errors,
the easiest way to start fresh with a simple document is to replace your standard `addHerbTransaction` call with direct Firestore writes.

### Quick Fix
To make a simple document in Firebase when adding a new crop, add this basic snippet right inside your farmer submission logic block (`app.js`):

```javascript
// Simple direct write to Firebase
if (typeof firebase !== 'undefined' && firebase.firestore) {
    var db = firebase.firestore();
    db.collection("collections").add({
        farmerName: farmerName,
        herbType: herbType,
        quantity: quantity,
        price: price,
        collectionDate: collectionDate,
        batchId: batchId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        alert("Firebase write failed. See console for details.");
    });
}
```

### Security Rules
Make sure to go to **Firebase Console -> Firestore Database -> Rules** and allow writes:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
