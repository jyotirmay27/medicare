import React, {useContext} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import "../../css/Allergy.css";
import Jumbotron from 'react-bootstrap/Jumbotron';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import {AuthContext} from '../../shared/util/AuthContext';
import { useParams } from "react-router-dom";

const ConfirmAppointment = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const docID=useParams().docID;
  const userID=useParams().userID;
  const placeSubmitHandler=async event =>{
     event.preventDefault();
     var date = document.getElementById('AF'). value;
     var time = document.getElementById('AR').value;

    try {
        await sendRequest(
            'https://localhost:5000/api/users/bookanappointment',
            'POST', 
            JSON.stringify({
              date: date,
              time:time,
               docID: docID,
               userID:userID,
            }),
     { 'Content-Type': 'application/json' }
     );
     console.log("fuckit")
     history.push('/');
  }catch(err){}
  };



return (
  <div className="BGGradeAllergy">
  <div className="TopMarginAllergy"></div>

  <div className="box" id="heading">
      <h1 className="Heading"> Appointment Confirmation</h1>{" "}
  </div>
  <Jumbotron className="container" bg-dark>
      <Form className="form-signin" onSubmit={placeSubmitHandler}>
          <Form.Group controlId="formGroupheart">
              <Form.Label className="AllergyFormTextLabel">
                  Date
              </Form.Label>
              <Form.Control
                  type="text"
                  id="AF"
                  placeholder="Date"
                  className="AllergyFormText"
              />
          </Form.Group>
          <Form.Group controlId="formGroupBP">
              <Form.Label className="AllergyFormTextLabel">
                  Time
              </Form.Label>
              <Form.Control
                  type="text"
                  id="AR"
                  className="AllergyFormText"
                  placeholder="Time"
              />
          </Form.Group>
          <br />
          <Button
              variant="primary"
              type="submit"
              className="AllergyButton"
          >
              Submit
          </Button>
      </Form>
  </Jumbotron>
</div>
);
};

export default ConfirmAppointment;