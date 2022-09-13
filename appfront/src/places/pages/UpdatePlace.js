import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceForm.css';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

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

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    // const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;
    const navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            } catch (err) {}
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);

    // useEffect(() => {
    //     if(identifiedPlace) {
    //     }
    //     setIsLoading(false);
    // },[setFormData, identifiedPlace])


    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        // console.log(formState.inputs);
        try {
            await sendRequest(
                `http://localhost:5000/api/places/${placeId}`, 
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            navigate('/' + auth.userId + '/places');
        } catch (err) {
            console.log(err);
        }
        
    };
    // console.log(isLoading);

    if (isLoading) {
        return (
            <div className="center">
                {/* <h2>Loading...</h2> */}
                <LoadingSpinner />
            </div>
        )
    }

    if (!loadedPlace && !error) {
        <div className="center">
            <Card>
                <h2>Cannot find the place</h2>
            </Card>
        </div>
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                <Input 
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true}
                />
                <Input 
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description"
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>Update place</Button>
            </form>}
        </React.Fragment>
    )
};

export default UpdatePlace;