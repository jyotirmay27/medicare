const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');
const User= require('../models/Users');
const Allergy= require('../models/Allergy');
const HttpError = require('../HttpError');
const Doctor = require('../models/Doctors');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');
const Combo = require('../models/Combo');
const Rating = require('../models/Rating');
const nodemailer = require("nodemailer");
const Reciepts = require('../models/Reciepts');
const Razorpay = require("razorpay");
require("dotenv").config();

const signup =async  (req, res, next) => {
  const errors = validationResult(req); // this will validate the checks we put on user router file for name email and password.
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { name, email, password } = req.body; // will recieve json data from front to process further
  console.log(email);
  let existingUser;
  try {
    existingUser =await User.findOne({ email: email}) // find the email in database
      
  } catch (err) {
      const error = new HttpError('SigningUP failed',500);
        return next(error);
      
  }
  
      if (existingUser) {
          const error = new HttpError('User already exist',422);
        return next(error);
          
      }

      let hashedPassword;
      try{
      hashedPassword = await bcrypt.hash(password,12); // hash the password to 12 digits
      }
      catch(err)
      {
        const error = new HttpError('could not create', 500);  
        return next(error);
      }
  const createdUser =new User ({ // create new user template to enter in database

    name, 
    email,
    password : hashedPassword,
    prescriptions:[],
    medication:[]
  });

  try {
    await createdUser.save(); // save the data in database by this line
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email }, // it will create a token storing email and user ID in it
      'supersecret_dont_share', // this is the key which is very specific and could lead to system hack
      { expiresIn: '1h' }// token will be expired in 1hr
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  res.status(201).json({user: createdUser.toObject({ getters: true }),token: token}); // returns the object of created user and token
};// getters: true will send response object ID as 'id' instead of '_id' which mongoDB created automatically

// this fetch the Prescriptions for the particular user

const addallergy =async  (req, res, next) => {
  const errors = validationResult(req);// this will validate the checks we put on user router file for the entries not to be empty.
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { from, reaction, creator } = req.body;


  const createdAllergy =new Allergy ({ // create a template for the database to store
    from, 
    reaction,
    creator
  });
  let patientId;

  try {
    patientId = await User.findOne({ email:creator  }) // find a user in database
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!patientId) {
    const error = new HttpError('Could not find patient for provided id.', 404);
    return next(error);
  }
  console.log(patientId);


  try {
    const sess = await mongoose.startSession();// start a session
     sess.startTransaction()// to transport data to database with condition the things inside 
                            //start transaction and commit transaction either all tasks will be executed or none will.
    await createdAllergy.save();// save the data in database by this line
    patientId.allergy.push(createdAllergy); // push in the array in user entry in database
    await patientId.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      ' failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({allergy: createdAllergy.toObject({ getters: true })});
};// getters: true will send response object ID as 'id' instead of '_id' which mongoDB created automatically

// this fetch the Prescriptions for the particular user

const addDoctors =async  (req, res, next) => {

  const { doctor,patient } = req.body;

  const createdCombo =new Combo({
    
       doctor,
       patient
});
  let patientId;

  try {
    patientId = await User.findOne({ email:patient  })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!patientId) {
    const error = new HttpError('Could not find patient for provided id.', 404);
    return next(error);
  }
  console.log(patientId);

  let docId;
  try {
    docId = await Doctor.findOne({ email:doctor }) // find the data in database
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!docId) {
    const error = new HttpError('Could not find doctor for provided id.', 404);
    return next(error);
  }
  console.log(docId);

  
  try {
    const sess = await mongoose.startSession();
     sess.startTransaction()// to transport data to database with condition the things inside 
                          //start transaction and commit transaction either all tasks will be executed or none will.
     await createdCombo.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      ' failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({doctors: patientId.doctors});
};


const Appointment =async  (req, res, next) => {
  const { date, name, patEmail, docEmail } = req.body;
  


var patName = name;


var transporter = nodemailer.createTransport({ // it will provide the mail id password from the the site has to send mails whenever required.
    service: 'gmail',
    auth: {
      user: 'codingstrings.js@gmail.com',
      pass: 'pizzapastasauce'
    }
  });
  let f;
  
  
  var mailOptions = { // this will set the content of the mail which the nodemailer will send.
    from: 'codingstrings.js@gmail.com',
    to: docEmail,
    subject: 'Book an appointment',
    html: `<p>Hello Doctor,</p>
            <p>The patient ${patName} (${patEmail}) wants to book an appointment with you for ${date}.</p>
            <a href= 'http://localhost:3000/confirmappointment/${patEmail}/${docEmail}'> click to confirm and add the time  </a>
            <a href= "http://localhost:3000/denyappointment"> click to deny we'll send a mail to choose another date to the user  </a>
            <p>Regards MediTech</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){ // it will trigger and a mail will be sent to the id provided by user 
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.json({message: 'Mail Sent!'});
};


const login =async  (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email }) // find the entry in database
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser ) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPassword= false;
  try {
  isValidPassword= await bcrypt.compare(password,existingUser.password) // will conpare the password you entered and which is saved hashed in database.
  }
  catch(err)
  {
    const error = new HttpError(
      ' could not log you in.',
      401
    );
    return next(error);

  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email }, // it will create a token using ur user ID and email.
      'supersecret_dont_share',// this is the key which is very specific and could lead to system hack
      { expiresIn: '1h' } // token will be expired in 1hr
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({message: 'Logged in!',
  user: existingUser.toObject({getters: true}),
  token:token});// getters: true will send response object ID as 'id' instead of '_id' which mongoDB created automatically

  // this fetch the Prescriptions for the particular user
};


// TODO
const updateRating = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   throw new HttpError('Invalid inputs passed, please check your data.', 422);
  // }

  const { rating } = req.body;
  const docId = req.params.did;

  let place;
  try {
    place = await Doctor.findOne({ email: docId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.rating = rating;


  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }
    console.log("here are we at rating");
  res.status(200).json({ message:"done" });
};

const addReview =async  (req, res, next) => {

  const { review } = req.body;
  const docId = req.params.did;
  const createdRating =new Rating({
    doctor:docId,
      review:review
});
console.log(review);
console.log("here we are at review");
try {
  const sess = await mongoose.startSession();
   sess.startTransaction()// to transport data to database with condition the things inside 
                        //start transaction and commit transaction either all tasks will be executed or none will.
   await createdRating.save({ session: sess }); 
   console.log("done");
  await sess.commitTransaction();
} catch (err) {
  const error = new HttpError(
    ' failed, please try again.',
    500
  );
  return next(error);
}

res.status(201).json({message: 'review added!'});
};

const Payment =async  (req, res, next) => {

  console.log("here we are")
  try {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });
    console.log("step1");
    const options = {
        amount: 100, // amount in smallest currency unit
        currency: "INR",
        receipt: "receipt_order_74394",
    };
    console.log(options);
    console.log("step2");

    ////const order = await instance.orders.create(options);
    // const order = await instance.orders.create(options);
    const order= await instance.orders.create(options, async function (err, order) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
    return res.status(200).json(order);
   });
    console.log({order});
    console.log("step3");
    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
} catch (error) {
    res.status(500).send(error);
}
}


const bookAnAppointment =async  (req, res, next) => {
  const { date, time, userID, docID } = req.body;
  


//var patName = name;


var transporter = nodemailer.createTransport({ // it will provide the mail id password from the the site has to send mails whenever required.
    service: 'gmail',
    auth: {
      user: 'codingstrings.js@gmail.com',
      pass: 'pizzapastasauce'
    }
  });
  let f=userID+docID;
  
  
  var mailOptions = { // this will set the content of the mail which the nodemailer will send.
    from: 'meditech.appointment@gmail.com',
    to: docID,
    subject: 'Confirmation of Appointment',
    html: `<p>Hello Doctor,</p>
            <p>The patient  (${userID}) has  booked an appointment with you for ${date} at (${time}).</p>
            <a href="https://localhost:5000/room1/${f}"> Link to th video call </a>
            <p>Regards MediTech</p>`
  };
  var mailOptions2 = { // this will set the content of the mail which the nodemailer will send.
    from: 'meditech.appointment@gmail.com',
    to: userID,
    subject: 'Confirmation of Appointment',
    html: `<p>Hello Patient,</p>
            <p>The doctor  (${docID}) has booked an appointment with you for ${date} at (${time}).</p>
            <a href="https://localhost:5000/room1/${f}"> Link to th video call </a>
            <p>Regards MediTech</p>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){ // it will trigger and a mail will be sent to the id provided by user 
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  transporter.sendMail(mailOptions2, function(error, info){ // it will trigger and a mail will be sent to the id provided by user 
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.json({message: 'Mail Sent!'});
};


const cancelAnAppointment =async  (req, res, next) => {
  const { userID, docID } = req.body;
  


//var patName = name;


var transporter = nodemailer.createTransport({ // it will provide the mail id password from the the site has to send mails whenever required.
    service: 'gmail',
    auth: {
      user: 'codingstrings.js@gmail.com',
      pass: 'pizzapastasauce'
    }
  });
  let f;
  
  
  var mailOptions = { // this will set the content of the mail which the nodemailer will send.
    from: 'meditech.appointment@gmail.com',
    to: userID,
    subject: 'Confirmation of Appointment',
    html: `<p>Hello Patient,</p>
            <p>The doctor (${docID}) is busy on ${date} please choose som other day for the appointment.</p>
            <p>Regards MediTech</p>`
  };
  // var mailOptions2 = { // this will set the content of the mail which the nodemailer will send.
  //   from: 'meditech.appointment@gmail.com',
  //   to: userID,
  //   subject: 'Confirmation of Appointment',
  //   html: `<p>Hello Patient,</p>
  //           <p>The doctor  (${userID}) has booked an appointment with you for ${date} at (${time}).</p>
  //           <p>Regards MediTech</p>`
  // };
  
  transporter.sendMail(mailOptions, function(error, info){ // it will trigger and a mail will be sent to the id provided by user 
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.json({message: 'Mail Sent!'});
};

// and finally export all files.
exports.addDoctors=addDoctors;
exports.addallergy=addallergy;
exports.signup = signup;
exports.login = login;
exports.Appointment=Appointment;
exports.updateRating=updateRating;
exports.addReview=addReview;
exports.Payment=Payment;
exports.bookAnAppointment=bookAnAppointment;
exports.cancelAnAppointment=cancelAnAppointment;