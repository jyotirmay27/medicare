import React, {useContext} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import './vitals.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import {AuthContext} from '../../shared/util/AuthContext';

const Vitals = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const placeSubmitHandler=async event =>{
     event.preventDefault();
     var date = document.getElementById('date'). value;
     var pulse = document.getElementById('pulse').value;
     var sugar = document.getElementById('sugar'). value;
     var BP = document.getElementById('BP').value;
    try {
        await sendRequest(
            'http://localhost:5000/api/places/vitals',
            'POST', 
            JSON.stringify({
               sugar:sugar, 
               BP: BP,
               pulse:pulse,
               date: date,
               creator: auth.userId
            }),
     { 'Content-Type': 'application/json' }
     );
     history.push('/');
  }catch(err){}
  };



return (
    <Jumbotron className="container" bg-dark >
<Form className="form-signin" onSubmit = { placeSubmitHandler}>
  <Form.Group controlId="formGroupheart">
    <Form.Label>Date</Form.Label>
    <Form.Control type="text" id="date" placeholder="Date" />
  </Form.Group>
  <Form.Group controlId="formGroupBP">
    <Form.Label>Blooad Pressure</Form.Label>
    <Form.Control type="text" id="BP" placeholder="Blooad Pressure" />
  </Form.Group>
  <Form.Group controlId="formGroupsugar">
    <Form.Label>Sugar</Form.Label>
    <Form.Control type="text" id="sugar" placeholder="Sugar" />
  </Form.Group>
  <Form.Group controlId="formGroupSystol">
    <Form.Label>Heart Rate</Form.Label>
    <Form.Control type="text" id="pulse" placeholder="Heart Rate" />
  </Form.Group>
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
</Jumbotron>
);
};

export default Vitals;