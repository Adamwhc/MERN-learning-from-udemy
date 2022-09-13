import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: "simple building",
//         description: 'sth for display',
//         imageUrl: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
//         address: 'from google map',
//         location: {
//             lat: 40,
//             lng: 50
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: "simple building",
//         description: 'sth for display',
//         imageUrl: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
//         address: 'from google map',
//         location: {
//             lat: 40,
//             lng: 50
//         },
//         creator: 'u2'
//     }
// ]

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (err) {}
        };
        fetchPlaces();  
    },[sendRequest, userId]);

    const placeDeleteHandler = (deletePlaceId) => {
        setLoadedPlaces(
            prevPlaces => prevPlaces.filter(place => place.id !== deletePlaceId)
        );
    };

    // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
        </React.Fragment>
    )
};

export default UserPlaces;