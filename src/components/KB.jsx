import React, { useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";


import "react-simple-keyboard/build/css/index.css";


function KB() {

  const [layout, setLayout] = useState("default");
  const keyboard = useRef();



  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = button => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") handleShift();
  };


  return (
    <div>
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layout}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export default KB
