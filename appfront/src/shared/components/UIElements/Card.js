import React from "react";

import './Card.css';

const Card = props => {
    // console.log(props.children)
    return (
        <div className={`card ${props.className}`} style={props.style}>
            {props.children}
        </div>
    );
};

export default Card;