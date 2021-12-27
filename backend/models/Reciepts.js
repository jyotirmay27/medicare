const mongoose=require('mongoose');

const Schema = mongoose.Schema; //syntax

  
const RecieptsSchema = new Schema({
    docId: { type: String , required: true},//the database will contain a row for 'reaction' in it
    userId: { type: String , required: true},//the database will contain a row for 'reaction' in it

    amount: { type: String , required: true},//the database will contain a row for 'creator' in it
    orderCreationId:{ type: String , required: true},
    razorpayPaymentId:{ type: String , required: true},
    razorpayOrderId:{ type: String , required: true},
    razorpaySignature:{ type: String , required: true}

});

module.exports = mongoose.model('Reciepts', RecieptsSchema); //'Allergy' written here will form a database of 'allergies' in mongo db