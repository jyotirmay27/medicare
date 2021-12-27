const Reciepts = require('../models/Reciepts');

const express = require('express');
// express-validator will info entered is coorect like if email is an email or not like that
const  {check} = require('express-validator')


const usersControllers = require('../controllers/userController');


const router = express.Router();

// when a user enters his/her allergy this router will send the request to POST to user controller
router.post('/allergy', [
    check('from').not().isEmpty(),
    check('reaction').not().isEmpty()
],usersControllers.addallergy);

// when a user enters his/her credentials this router will send the request to POST to user controller
router.post('/signup', [
    check('name').not().isEmpty(),
    check('email') // Test@test.com => test@test.com
    .isEmail(),
    check('password').isLength({min : 6})
],usersControllers.signup);

/* when a user enters his/her information this router will send the request to user controller 
it will send a mail to a particular doctor from our site to confirm the appointment and revert the mail to patient */
router.post('/appointment', usersControllers.Appointment);

// when a user enters his/her credentials this router will send the request to user controller to verify if its correct
router.post('/login', usersControllers.login);

router.post('/bookanappointment', usersControllers.bookAnAppointment);

router.post('/cancelanappointment', usersControllers.cancelAnAppointment);


router.post("/payment/orders/:did/:uid",usersControllers.Payment);

router.post("/payment/success/:did/:uid", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        const docId=req.params.did;
        const userId=req.params.uid;
        const createdReciepts =new Reciepts ({ // create a template for the database to store
          docId:docId,
          userId:userId,
          amount:50000,
          orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        });
        try {
            const sess = await mongoose.startSession();
   sess.startTransaction()// to transport data to database with condition the things inside  //start transaction and commit transaction either all tasks will be executed or none will.
   await createdReciepts.save({ session: sess }); 
   console.log("payment done");
  await sess.commitTransaction();
          } catch (err) {
            const error = new HttpError(
              ' failed, please try again.',
              500
            );
          }

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// it will send the request to user controller to add the doctor to YOUR DOCTOR column in user portal 
router.post('/doctor/:uid', usersControllers.addDoctors);

router.patch('/doctor/:did/rating', usersControllers.updateRating);

router.post('/doctor/:did/review', usersControllers.addReview);






module.exports  = router;