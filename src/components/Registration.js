import React, { useReducer, useState, useRef } from "react";
import Button from "./UI/Button";
import Input from "./UI/Input";
import classes from "./Registration.module.css";

//Email reducer
const emailReducer = (state, action) => {
  if (action.type === "EMAIL") {
    return { value: action.val, isValid: action.val.includes("@") };
  }

  if (action.type === "EMAIL_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

//Name reducer
const nameReducer = (state, action) => {
  if (action.type === "NAME") {
    return { value: action.val, isValid: action.val.trim().length >= 2 };
  }

  if (action.type === "NAME_BLUR") {
    return { value: state.value, isValid: state.value.trim().length >= 2 };
  }

  return { value: "", isValid: false };
};

const Registration = (props) => {
  //CheckBox
  const [isChecked, setIsChecked] = useState(false);

  //Email handler
  const emailInputRef = useRef();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: props.item.email,
    isValid: true,
  });

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "EMAIL", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "EMAIL_BLUR" });
  };

  //Name Handler
  const nameInputRef = useRef();

  const [nameState, dispactName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });

  const nameChangeHandler = (event) => {
    dispactName({ type: "NAME", val: event.target.value });
  };

  const validateNameHandler = () => {
    dispactName({ type: "NAME_BLUR" });
  };

  //Registration Handler
  const submitHandler = (event) => {
    event.preventDefault();
    if (emailState.isValid && nameState.isValid && isChecked) {
      const item = {
        email: emailState.value,
        name: nameState.value,
      };

      registrationHandler(item);
    }
  };

  //CheckBox reference
  const checkBoxHandler = (event) => {
    setIsChecked(event.target.checked);
  };

  async function registrationHandler(item) {
    const response = await fetch(
      "https://ncp.staging.moonproject.io/api/juhasz-norbert/user/register",
      {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.data.success) {
      props.addCodeHandler(props.item);
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>Regisztráció</label>
      </div>
      <Input
        ref={emailInputRef}
        label="E-MAIL CÍM:"
        type="email"
        id="email"
        isValid={emailState.isValid}
        value={emailState.value}
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}
        readOnly={true}
      />
      <Input
        ref={nameInputRef}
        label="NÉV:"
        type="text"
        id="name"
        isValid={nameState.isValid}
        value={nameState.value}
        onChange={nameChangeHandler}
        onBlur={validateNameHandler}
      />
      <input
        onChange={checkBoxHandler}
        type="checkbox"
        id="box"
        name="box"
        value={isChecked}
      />
      <label> Elolvastam és elfogadom a játékszabályokat.</label>
      <br></br>
      <div className={classes.actions}>
        <Button type="submit" className={classes.btn}>
          Regisztrálok
        </Button>
      </div>
    </form>
  );
};

export default Registration;
