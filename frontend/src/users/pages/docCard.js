import React from "react";
import Card from "react-bootstrap/Card";
import Akira from "../../jj.jpg";
import "../../css/DoctorListCard.css";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
const DocCard = (props) => {
    const history = useHistory();
    const giveRating = async ()=>{
        history.push(`/rating/${props.doctor}`);
    }
    const doPayment = async ()=>{
        history.push(`/payment/${props.doctor}`);
    }

    return (
        <div>
            
            <Card border="info" className="DoctorListCards">
                <br />
                <Link to={`/doctorsprofile/${props.doctor}`}>
                <font className="DoctorIcon">
                    <i className="fas fa-user-md fa-9x"></i>
                </font>
                </Link>
                <Card.Body>
                    <Card.Title style={{ fontSize: "1rem", color: "#195a65" }}>
                        {props.doctor}
                    </Card.Title>
                    <Button
                        variant="info"
                        className="DoctorListButtonDoctor"
                        onClick={giveRating}
                    >
                        Rate n<b> Review</b>
                    </Button>
                    <Button
                        variant="success"
                        className="DoctorListButtonDoctor"
                        onClick={doPayment}
                    >
                        Pay
                    </Button>
                </Card.Body>
            </Card>
            
        </div>
    );
};

export default DocCard;