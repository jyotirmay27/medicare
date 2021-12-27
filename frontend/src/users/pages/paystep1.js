import React, {useEffect,useContext, useState} from "react";
import { AuthContext } from '../../shared/util/AuthContext';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { Card, Button, Form,Row, InputGroup} from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import axios from "axios";
import logo from "../../PageBG.jpeg";
import { useParams } from 'react-router-dom';


function Payment() {
    const auth = useContext(AuthContext);
    const userId= auth.userId;
    const docID=useParams().docID;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const result = await axios.post(`https://localhost:5000/api/users/payment/orders/${docID}/${userId}`);

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_Q8GP4WnFGR7Nen", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Soumya Corp.",
            description: "Test Transaction",
            image: { logo },
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await sendRequest(
                    `https://localhost:5000/users/payment/success/${docID}/${userId}`,
                    'POST',
                    JSON.stringify({
                        orderCreationId: order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    }),
                    {
                      'Content-Type': 'application/json'
                    }
                  );
                //await axios.post(`http://localhost:5000/users/payment/success/${docID}/${userId}`, data);

                alert(result.data.msg);
            },
            prefill: {
                name: "Soumya Dey",
                email: "SoumyaDey@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Soumya Dey Corporate Office",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return (
        <div className="BGGradeAllergy">
  <div className="TopMarginAllergy"></div>

  <div className="box" id="heading">
      <h1 className="Heading"> Paying Form</h1>{" "}
  </div>

                <button className="App-link" onClick={displayRazorpay}>
                    Pay ₹50
                </button>
            
        </div>
    );

}


export default Payment;
