const mongoose = require('mongoose');
const initData = require('./data');
const listing = require('../models/listing.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
})

async function initdata(){
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '6776444c5d2d9342b84f7c0e'}));
    await listing.insertMany(initData.data);
    console.log("data was initialized")
}

initdata();