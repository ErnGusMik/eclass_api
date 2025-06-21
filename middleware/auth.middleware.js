import admin from 'firebase-admin';
async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({
        error: "Unauthorized: No token provided"
    })

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log('Toekn verification failed: ' + error)
        return res.status(401).json({ error: "Unauthorized: Invalid token" })
    }
}

export default verifyFirebaseToken;

// req.user structure:
// {
//   name: '',
//   picture: '',
//   iss: '',
//   aud: '',
//   auth_time: int,
//   user_id: '',
//   sub: '',
//   iat: int,
//   exp: int,
//   email: '',
//   email_verified: bool,
//   firebase: {
//     identities: { 'google.com': [Array], email: [Array] },
//     sign_in_provider: 'google.com'
//   },
//   uid: ''
// }