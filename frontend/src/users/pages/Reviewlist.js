import React from 'react';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { CardDeck, CardGroup } from "react-bootstrap";
import ReviewCard from './reviewCard';



const ReviewList = props =>{
    if( props.items.length === 0)
    {
        return (
        <div className=" place-list centre">
            <Card>
                <h2> No Reviews Found.</h2>
                
            </Card>
        </div>
        );
    }
    return(
    <CardDeck>
    {props.items.map( pres=> (
    <ReviewCard
    id={pres.id}
    doctor={pres.doctor}
    review ={pres.review}
    
    />))}
    </CardDeck> 

    );
};
 export default ReviewList;