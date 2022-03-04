import React, { useReducer, useState, useRef, useEffect } from "react";
import Button from "./UI/Button";
import Input from "./UI/Input";
import classes from "./Upload.module.css";

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

//Code reducer
const codeReducer = (state, action) => {
  if (action.type === "CODE") {
    return { value: action.val, isValid: action.val.trim().length === 8};
  }

  if (action.type === "CODE_BLUR") {
    return { value: state.value, isValid: state.value.trim().length === 8};
  }

  return { value: "", isValid: false };
};

const Upload = (props) => {
  //CheckBox
  const [isChecked, setIsChecked] = useState(false);

  //Date
  const [choosedDate, setChoosedDate] = useState("");
  const [actualMonth, setActualMonth] = useState();
  const [actualDay, setActualDay] = useState();
  const [actualYear, setActualYear] = useState();
  const [choosedMonth, setChoosedMonth] = useState();
  const [choosedDay, setChoosedDay] = useState();
  const [hour, setHour] = useState();
  const [minute, setMinute] = useState();

  useEffect(() => {
    let actualDate = new Date();
    let year = actualDate.getFullYear();

    let month;
    if((actualDate.getMonth()+1) < 10) {
      month = "0" + (actualDate.getMonth()+1);
    } else {
      month = (actualDate.getMonth()+1);
    }

    let day;
    if(actualDate.getDate() < 10) {
      day = "0" + actualDate.getDate();
    } else {
      day = actualDate.getDate();
    }

    setActualMonth(month);
    setActualDay(day);
    setActualYear(year);
    setChoosedDate(year + "-" + month + "-" + day);
  },[]);

  useEffect(() => {
    let items = choosedDate.split("-");
    setChoosedMonth(items[1]);
    setChoosedDay(items[2]);
  }, [choosedDate, choosedMonth, choosedDay]);

  //Email Handler
  const emailInputRef = useRef();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "EMAIL", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "EMAIL_BLUR" });
  };

  //Code Handler
  const codeInputRef = useRef();

  const [codeState, dispactCode] = useReducer(codeReducer, {
    value: "",
    isValid: null,
  });

  const codeChangeHandler = (event) => {
    dispactCode({ type: "CODE", val: event.target.value });
  };

  const validateCodeHandler = () => {
    dispactCode({ type: "CODE_BLUR" });
  };

  //DateHandler
  const setDateHandler = (event) => {
    setChoosedDate(event.target.value);
  };

  const hourChangeHandler = (event) => {
    if(event.target.value < 10) {
      setHour("0" + event.target.value);
    } else {
      setHour(event.target.value);
    }
  }

  const minuteChangeHandler = (event) => {
    if(event.target.value < 10) {
      setMinute("0" + event.target.value);
    } else {
      setMinute(event.target.value);
    }
  }

  //CheckBox reference
  const checkBoxHandler = (event) => {
    setIsChecked(event.target.checked);
  };

  //Uploaded Code Handler
  const submitHandler = (event) => {
    event.preventDefault();

    if (emailState.isValid && codeState.isValid && isChecked && choosedDay <= actualDay && choosedMonth <= actualMonth) {
      const item = {
        email: emailState.value,
        code: codeState.value,
        purchase_time: actualYear + "-" + choosedMonth + "-" + choosedDay + " " + hour + ":" + minute,
      };

      props.addCodeHandler(item);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>Kódfelöltés</label>
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
      />
      <Input
        ref={codeInputRef}
        label="KÓD:"
        type="text"
        id="code"
        isValid={codeState.isValid}
        value={codeState.value}
        onChange={codeChangeHandler}
        onBlur={validateCodeHandler}
        pattern="[A-Za-z0-9]{8}" 
        title="Használható betűk és számok: a-z, A-Z, 0-9"
      />
      <Input
        type="date"
        label="DÁTUM:"
        onChange={setDateHandler}
        min="2022-02-01"
        max="2022-03-31"
        value={choosedDate}
      />
      <Input type="number" label="ÓRA:" min="0" max="23" onChange={hourChangeHandler}/>
      <Input type="number" label="PERC:" min="0" max="59" onChange={minuteChangeHandler}/>
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
          Kódfelöltés
        </Button>
      </div>
    </form>
  );
};

export default Upload;
