const mongoose=require('mongoose');

const Schema = mongoose.Schema; //syntax

  
const RatingSchema = new Schema({
   doctor: { type: String , required: true},//the database will contain a row for 'reaction' in it
    review: { type: String , required: true}//the database will contain a row for 'creator' in it

});

module.exports = mongoose.model('Rating', RatingSchema); //'Allergy' written here will form a database of 'allergies' in mongo db