import React, { useRef, useEffect } from 'react';
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

const KB = ({ onKeyPress }) => {
  const keyboardRef = useRef(null);
  const keyboard = useRef(null);

  const handleShift = () => {
    const currentLayout = keyboard.current.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
    
    keyboard.current.setOptions({
      layoutName: shiftToggle
    });
  };

  const handleNumbers = () => {
    const currentLayout = keyboard.current.options.layoutName;
    const numbersToggle = currentLayout !== "numbers" ? "numbers" : "default";
    
    keyboard.current.setOptions({
      layoutName: numbersToggle
    });
  };

  useEffect(() => {
    if (!keyboard.current && keyboardRef.current) {
      keyboard.current = new Keyboard(".simple-keyboard", {
        onKeyPress: button => {
          if (button === "{shift}") {
            handleShift();
          } else if (button === "{numbers}") {
            handleNumbers();
          } else if (button === "{abc}") {
            keyboard.current.setOptions({
              layoutName: "default"
            });
          } else if (onKeyPress) {
            onKeyPress(button);
          }
        },
        mergeDisplay: true,
        layoutName: "default",
        layout: {
          default: [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m {numbers}"
          ],
          shift: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shift} Z X C V B N M {numbers}"
          ],
          numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0"]
        },
        display: {
          "{numbers}": "123",
          "{shift}": "⇧",
          "{abc}": "ABC"
        }
      });
    }

    return () => {
      if (keyboard.current) {
        keyboard.current.destroy();
        keyboard.current = null;
      }
    };
  }, []);



  return (
    <div>
      <div ref={keyboardRef} className="simple-keyboard"></div>
    </div>
  );
};

export default KB;
