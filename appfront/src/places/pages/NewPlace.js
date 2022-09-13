import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceForm.css';

// const formReducer = (state, action) => {
//     switch (action.type) {
//         case 'INPUT_CHANGE':
//             let formIsValid = true;
//             // console.log('state', state);
//             // console.log('action', action);
//             for (const inputId in state.inputs) {
//                 if (inputId === action.inputId) {
//                     formIsValid = formIsValid && action.isValid;
//                 } else {
//                     formIsValid = formIsValid && state.inputs[inputId].isValid;
//                 }
//             }
//             return {
//                 ...state,
//                 inputs: {
//                     ...state.inputs,
//                     [action.inputId]: {value: action.value, isValid: action.isValid }
//                 },
//                 isValid: formIsValid
//             };
//         default:
//             return state;
//     }
// };

// const NewPlace = () => {
//     const [formState, dispatch] = useReducer(formReducer, {
//         inputs: {
//             title: {
//                 value: '',
//                 isValid: false
//             },
//             description: {
//                 value: '',
//                 isValid: false
//             }
//         },
//         isValid: false
//     });

//     const inputHandler = useCallback((id, value, isValid) => {
//         dispatch({
//             type: 'INPUT_CHANGE', 
//             value: value, 
//             isValid: isValid, 
//             inputId: id
//         });
//     }, []);

//     const placeSubmitHandler = event => {
//         event.preventDefault();
//         console.log(formState.inputs);
//     }

//     // console.log('test change',formState);
//     console.log('form is valid',formState.isValid);
//     return (
//         <form className="place-form" onSubmit={placeSubmitHandler}>
//             <Input 
//                 id="Title"
//                 element="input" 
//                 type="text" 
//                 label="Title" 
//                 validators={[VALIDATOR_REQUIRE()]} 
//                 errorText="Please enter a valid title" 
//                 onInput={inputHandler}
//             />

//             <Input 
//                 id="description"
//                 element="textarea" 
//                 label="Description" 
//                 validators={[VALIDATOR_MINLENGTH(5)]} 
//                 errorText="Please enter a valid description" 
//                 onInput={inputHandler}
//             />

//             <Input
//                 id="address"
//                 element="input"
//                 label="Address"
//                 validators={[VALIDATOR_REQUIRE()]}
//                 errorText="Please enter a valid address."
//                 onInput={inputHandler}
//             />
//             <Button type="submit" disabled={!formState.isValid}>
//                 ADD PLACE
//             </Button>
//         </form>
//     );
// };
  
const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
 
    const [formState, inputHandler] = useForm({
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        },
        address: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }
      },
      false
    );

    const navigate = useNavigate();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        // console.log(formState.inputs); // send this to the backend!
        try {
          const formData = new FormData();
          // console.log(formState.inputs);
          formData.append('title', formState.inputs.title.value);
          formData.append('description', formState.inputs.description.value);
          formData.append('address', formState.inputs.address.value);
          formData.append('creator', auth.userId);
          formData.append('image', formState.inputs.image.value);
          // for (var value of formData.values()) {
          //   console.log(value);
          // }
          await sendRequest(
            'http://localhost:5000/api/places', 
            'POST', 
            formData,
            {
              Authorization: 'Bearer ' + auth.token
            }
          );
          navigate('/');
        } catch (err) {
          console.log(err);
        }
        
    };
    
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <form className="place-form" onSubmit={placeSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
          />
          <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (at least 5 characters)."
              onInput={inputHandler}
          />
          <Input
              id="address"
              element="input"
              label="Address"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid address."
              onInput={inputHandler}
          />
          <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
          <Button type="submit" disabled={!formState.isValid}>
              ADD PLACE
          </Button>
        </form>
      </React.Fragment>
    );
};
  

export default NewPlace;