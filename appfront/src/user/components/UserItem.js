import React from "react";
import { Link } from "react-router-dom";

import './UserItem.css';
import Avatar from '../../shared/components/UIElements/Avatar';
import Card from "../../shared/components/UIElements/Card";

const UserItem = props => {
    // console.log(props)
    return (
        <li className="user-item">
            
            <Card className="user-item_content">
                <Link to={`/${props.id}/places`}>
                    <div className="user-item_image">
                        {/* <img src={props.image} alt={props.name} /> */}
                        <Avatar image={props.image} alt={props.name} />
                    </div>
                    <div className="user-item_info">
                        <h2>{props.name}</h2>
                        <h3>{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}</h3>
                    </div>
                </Link>
            </Card>
    
        </li>
    );
};

export default UserItem;