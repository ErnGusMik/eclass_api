import express from 'express';
import { configDotenv } from 'dotenv';
import pool from './config/db.js';
import authRouter from './routes/auth.routes.js';
import teacherLessonRouter from './routes/teacher/lessons.routes.js';
import teacherClassRouter from './routes/teacher/classes.routes.js';
import noticesRouter from './routes/notices.routes.js';
import teacherRouter from './routes/teacher/teacher.routes.js';
import scheduleRouter from './routes/schedules.routes.js';
import serviceAccount from './firebaseServiceAccountKey.json' with { type: 'json' };


import admin from 'firebase-admin';

configDotenv();

const app = express();
const PORT = process.env.SERVER_PORT | 8080;

app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({extended: true}))
app.use(express.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.get('/', (req, res) => {
    res.send('App works')
})


app.use('/auth/', authRouter),
app.use('/teacher/', teacherRouter)
app.use('/teacher/lesson/', teacherLessonRouter)
app.use('/teacher/class/', teacherClassRouter)
app.use('/notices', noticesRouter)
app.use('/schedules/', scheduleRouter)


app.listen(PORT, async () => {
    console.log('Eclass server listening on port ' + PORT)
    try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('DB connected');
    } catch (e) {
        throw new Error('Connection to DB failed: ' + e);
    }
})