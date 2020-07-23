# Firebase Authentication for Google Apps Scripts

**This library is under development, so breaking change may be landed in frequently.**

This library focuses to support the APIs on https://firebase.google.com/docs/reference/rest/auth like [firebase-admin-node](https://github.com/firebase/firebase-admin-node) interface.

## Installation

Please enter **`M1lZwUjHOhi_bxE4didbbG5jiNITGdNhd`** as GAS library for your project.

## Usage

### Configurating Firebase Authentication instance from your script.

Let's start creating instance with the following code:

``` js
const auth = FirebaseAuthentication.getAuth(email, key, projectId);
```

You need to set arguments as below:
- `email` … client email address
- `key` … private key
- `projectId` … your project id

### Configuration Template

Here's a quick template to get you started (by replacing email and key with your values):

``` js
const email = 'projectname-12345@appspot.gserviceaccount.com';
const key = '-----BEGIN PRIVATE KEY-----\nPrivateKeyLine1\nPrivateKeyLine2\nPrivateKeyLineN\n-----END PRIVATE KEY-----';
const projectId = 'projectname-12345'
const auth = FirebaseAuthentication.getAuth(email, key, projectId);
```

### Listing User

``` js
auth.getUserByEmail(email);
auth.getUsers();
```

### Creating User

``` js
// This value must include a key that identify user, like `email`.
const user = {...};

// To create an user.
auth.createUser(user);

// To create some users.
auth.createUsers([user]);
```

### Updating User

``` js
const user = {...};

auth.updateUser(user);
```

### Deleting User
``` js
// User id to identify on Firebase Authentication
const localId = '...';

auth.deleteUser(localId);
auth.deleteUsers([localId], true);
```

## For TypeScript Users

Please install `FirebaseAuthenticationGoogleAppsScript` as a node module to import type declaration.

``` sh
$ yarn install --dev FirebaseAuthenticationGoogleAppsScript
# Or, $ npm install --save-dev FirebaseAuthenticationGoogleAppsScript
```

Then, add the following `import` sentence into your module.

``` ts
import { FirebaseAuthentication } from 'firebase-authentication-google-apps-script';

const auth = FirebaseAuthentication.getAuth(email, key, projectId);
```

## Development
### Setup

1. Create your own script.

``` sh
$ yarn run setup
```

2. Connect script to your Cloud Platform Project.

See for details: https://developers.google.com/apps-script/guides/cloud-platform-projects#switching_to_a_different_standard_gcp_project

3. Create OAuth Client and login with your Cloud Platform Credential.

See for details: https://developers.google.com/apps-script/guides/cloud-platform-projects#creating_oauth_credentials

### Test

``` sh
$ yarn run test
```

## TODO

This library doesn't support some APIs and requires developer friendly futures.
See [issues](https://github.com/tricknotes/FirebaseAuthenticationGoogleAppsScript/issues) for details. 

# References

This project is inspired by the following libraries:
- https://github.com/grahamearley/FirestoreGoogleAppsScript
- https://github.com/firebase/firebase-admin-node
