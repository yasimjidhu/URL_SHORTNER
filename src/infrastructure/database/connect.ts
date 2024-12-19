import mongoose from 'mongoose'
import config from '../../config/env'

const connectDB = async ()=>{
    try{
        await mongoose.connect(config.mongoURI as string)
        console.log('mongodb connected')
    }catch(error){
        console.error('Mongodb connection error',error)
        process.exit(1)
    }
}

export default connectDB;
