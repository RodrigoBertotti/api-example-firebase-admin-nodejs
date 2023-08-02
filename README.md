# api-example-firebase-admin-nodejs

A Node.js REST API example that uses Firebase Admin, built with Express and Typescript that can be used as template for the creation of new servers.

The main aspects of this sample are:

- A project structure that fits well for new API projects that uses **Firebase Authentication** and **Firestore**
- Access Control: Restricting routes access with custom claims and checking nuances
- Reject a request outside the controller easily by throwing `new HttpResponseError(status, codeString, message)`
- Logs: **winston** module is preconfigured to write `.log` files
- Serialization of objects, so you can easily perform write operations on Firestore of custom prototypes objects
- Caching: A wrapper function which helps to avoid identical queries on the Firestore Database

:iphone: **Check also the [Flutter side](https://github.com/RodrigoBertotti/flutter_client_for_api_example) 
example which interacts with this API example.**

## Summary

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Access Control](#access-control-custom-claims)
4. [Errors and permissions](#errors-and-permissions)
5. [Logs](#logs)
6. [Serialization of objects](#serialization-of-objects)
7. [Caching Firestore results](#caching-firestore-results)
8. [Reference](#reference)

## Getting Started

### Step 1 - Generate your `firebase-credentials.json` file

1) Go to your Firebase Project 
2) Click on the engine icon (on right of "Project Overview")
3) "Project Settings"
4) "Service Accounts"
5) "Firebase Admin SDK" and make sure the "Node.js" option is selected
6) Click on "Generate new private key". Rename the downloaded file to `firebase-credentials.json` and move it to inside the
`environment` folder. 

⚠️ Keep `firebase-credentials.json` and `environment.ts` local,
don't commit these files, keep both on `.gitignore`

As any Firebase server, the API has adminstrative priviliges,
that means the API has full permission to perform changes on the Firestore Database (and
other Firebase Resources) regardless how the Firestore Security Rules is configured.

### Step 2 - To test your server locally:

This command will start and restart your server as code changes are made,
do not use on production

    npm run dev

Let's run `npm install` to install the dependencies and `npm run dev` 
to start your server locally on port 3000.

#### Other commands for production environment

#### To build your server:

    npm run build

#### To start your server

    npm run start

### Step 3 - Interact with your server

:iphone: Check this [Flutter project](https://github.com/RodrigoBertotti/flutter_client_for_api_example) 
to interact with the server,
you can also create your own client that uses the Firebase Authentication
library, like React, Angular, Vue, etcetera.

### Step 4 - Your time!

We are done! Customize this API on your way!

---

## Authentication

Firebase Authentication is used to verify
if the client is authenticated on Firebase Authentication,
to do so, the client side should inform the `Authorization` header:

### `Authorization` Header

The client's token on Firebase Authentication in the format `Bearer <token>`, 
it can be obtained in the client side after the authentication is performed with the
Firebase Authentication library for the client side.

### Flutter Client Example on how to get the `Authorization`:

    final dioLoggedIn = Dio(BaseOptions(
        baseUrl: 'https://myapi.example.com',
        headers: {
             "Authorization": "Bearer ${(await FirebaseAuth.instance.currentUser!.getIdToken())}"
        }
    ));
    // dioLoggedIn.get('/user').then(...);

:iphone: [Click here](https://github.com/RodrigoBertotti/flutter_client_for_api_example)
to check a Flutter client example for this API

---

## Access Control (custom claims)

This project uses custom claims on Firebase Authentication to
define which routes the users have access to.

### Define custom claims to a user

This can be done in the server like bellow:

    await admin.auth().setCustomUserClaims(user.uid, {
         storeOwner: true,
         buyer: false
    });

### Configuring the routes

You can set a param (array of strings) on the `httpServer.<method>`
function, like:

    httpServer.get ('/product/:productId/full-details', 
      this.getProductByIdFull.bind(this), ['storeOwner']);

In the example above, only users with the `storeOwner` custom claim will
have access to the `/product/:productId/full-details` path.

Is this enough? Not always, so let's check the next section [Errors and permissions](#errors-and-permissions).

---

## Errors and permissions

You can easily send an HTTP response with code between 400 and 500 to the client
by simply throwing a `new HttpResponseError(...)` on your controller, service or repository,
for example:

    throw new HttpResponseError(400, 'BAD_REQUEST', "Missing 'name'");

Sometimes defining roles isn't enough to assure that a user can't 
access or modify a specific data,
let's imagine if a storeOwner tries to get full details
of a product he is not selling, like a product of another storeOwner,
he still has access to the route because of his `storeOwner` custom claim,
but an additional verification is needed.

    if (product.storeOwnerUid != req.auth!.uid) {
        throw new HttpResponseError(
            403, 
            'FORBIDDEN', 
            `Even though you are a storeOwner,
            you are a owner of another store,
            so you can't see full details of this product`
        );
    }

---

## Authentication fields

This project adds 3 new fields to the request object on the 
express request handler:

### `req.authenticated` 
type: `boolean`

Is true only if the client is authenticated, that means, the client
informed `Authorization` on the headers, and these
values were successfully validated.

### `req.auth` 
type: [UserRecord](https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth.userrecord) | `null`

If authenticated: Contains user data of Firebase Authentication.

### `req.token` 
type: [DecodedIdToken](https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth.decodedidtoken) | `null`

If authenticated: Contains token data of Firebase Authentication.

---

## Logs

You can save logs into a file by importing these functions of the `src/utils/logger.ts` file
and using like:

    log("this is a info", "info");
    logDebug("this is a debug");
    logInfo("this is a info");
    logWarn("this is a warn");
    logError("this is a error");

By default, a `logs` folder will be generated
aside this project folder, in this structure:

    - /api-example-firebase-nodejs
    --- /node_modules/*
    --- /src/*
    --- (and more)

    - /logs
    --- /api-example-firebase-nodejs
    ------ 2022-8-21.log
    ------ 2022-8-22.log
    ------ 2022-8-23.log
    ------ (and more)

Each `.log` file contains the logs of the respective day.

You can also go to `src/utils/logger.ts` and check `logsFilename` and `logsPathAndFilename` fields
to change the default path and filename so the logs can be saved with a different file name and
in a different location.

By default, regardless of the log level, all logs will be saved in the same file,
you can also change this behavior on the `winston.createLogger(transports: ...)` line of 
the `src/utils/logger.ts` file. 

---

## Serialization of objects

You will get an error if you create your own class, instantiate an object of it
and try to save directly on Firestore:


    await db().collection('products').doc().set(new ProductEntity(...));

    Error: Value for argument "data" is not a valid Firestore document.
    Couldn't serialize object of type "ProductEntity". 
    Firestore doesn't support JavaScript objects with custom prototypes 
    (i.e. objects that were created via the "new" operator).

To fix this problem, this project has a function called `serializeFS(object)` which
accepts an object as param.

    await db().collection('products').doc().set(serializeFS(new ProductEntity(...)));

---

## Caching Firestore results

Sometimes you need to fetch for the same data on the database in two or more
functions, you may need to fetch for `product` in the database
to check if the client has permission to read it, and if so, you may want to
return the exact same `product` as response.

The commom solution is to pass the cached data as param on different functions.
This project also offers an alternative way of caching:

You can use `req.cacheOf(cacheId, function)` in the request handler to wrap a function into
a new function that will cache the result, in this way, a cache will be created in the
first time this function is called and will be used as result when this function is called 
again.

    // If there's a cache: it will use the cache, otherwise: it will wait for the getProductById result and cache it
    const getProductByIdCached = req
        .cacheOf('productId_param', productsRepository.getProductById); // <-- Wrapped with a cache function
    const product = await getProductByIdCached(req.params['productId']);

The cache will be valid for a single request handler, so you will not have
problems of inconsistent cache on different requests, because 
each request has its own cache.

But if the data changes, and you want to invalidate the cache on that
request handler, you can call `req.invalidateCache(cacheId)`, for example:

    req.invalidateCache('productId_param');

Calling `req.invalidateCache` will not affect the other requests.

---

## Reference

This project based part of the structure of the GitHub project [node-typescript-restify](https://github.com/vinicostaa/node-typescript-restify).
Thank you [developer](https://github.com/vinicostaa/)!
