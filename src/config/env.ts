import dotenv from 'dotenv'

dotenv.config()

export default {
    httpPort:process.env.HTTP_PORT,
    mongoURI:process.env.MONGO_URI,
    redisHost:process.env.REDIS_HOST,
    redisPort:process.env.REDIS_PORT,
    baseUrl:process.env.BASE_URL,
    redisUrl:process.env.REDIS_URL,
    jwtSecret:process.env.JWT_SECRET,
    googleClientID:process.env.GOOGLE_CLIENT_ID,
    googleClientSecret:process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl:process.env.GOOGLE_CALLBACK_URL
}