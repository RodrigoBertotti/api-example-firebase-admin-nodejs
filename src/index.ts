import express, {Express,} from 'express';
import {interceptors} from "./interceptors";
import {log} from "./utils/logger";
import bodyParser from "body-parser";
import * as admin from "firebase-admin";
import {environment} from "./environment/environment";
import {HttpServer} from "./controllers";
import {CONTROLLERS} from "./controllers/controllers";

if(!environment?.firebase?.credentials?.project_id?.length){
    throw Error('Missing Firebase Credentials. Please, check the "Getting Started" section');
}

admin.initializeApp({
    credential: admin.credential.cert(environment.firebase.credentials as any),
    projectId: environment.firebase.credentials.project_id,
    databaseURL: environment.firebase.databaseURL
});

const app: Express = express();
const httpServer = new HttpServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

for(let i=0;i<interceptors.length;i++){
    app.use(interceptors[i]);
}

CONTROLLERS.forEach((controller) => {
   controller.initialize(httpServer);
});

app.listen(port, () => {
    log(`⚡️[server]: Server is running at https://localhost:${port}`);
});