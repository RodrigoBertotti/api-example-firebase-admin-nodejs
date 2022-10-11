import * as firebaseCredentials from './firebase-credentials.json';

/** YOU CAN ADD OTHER ENVIRONMENT CREDENTIALS ON THIS FILE,
 *  NEVER COMMIT THIS FILE
 *  KEEP THIS FILE ON YOUR .gitignore */

export const environment = {
    firebase: {
        databaseURL: `https://${(firebaseCredentials?.project_id ?? '')}.firebaseio.com`,
        credentials: firebaseCredentials,
    }
}