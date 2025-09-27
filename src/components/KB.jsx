import  { useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";


const KB = ({
  keyCallback
}
) => {

  const [layout, setLayout] = useState("default");
  const keyboard = useRef();

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = button => {
    
    if (button === "{shift}" || button === "{lock}") {
      handleShift()
    } else {
keyCallback(button)
    }
  };

  return (
    <div>
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layout}
        onKeyPress={onKeyPress}
         layout={{
            default: [
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "{shift} z x c v b n m {shift}"
            ],
            shift: [
              "Q W E R T Y U I O P",
              'A S D F G H J K L',
              "{shift} Z X C V B N M {shift}"
            ]
          }}
      />
    </div>
  );
}

export default KB
