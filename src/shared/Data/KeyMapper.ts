export namespace KeyMapper {

    const keyMapping = new Map<Enum.UserInputType | Enum.KeyCode, string>([
        // Mouse Inputs
        [Enum.UserInputType.MouseButton1, "M1"],
        [Enum.UserInputType.MouseButton2, "M2"],
        [Enum.UserInputType.MouseButton3, "M3"],

        // Keyboard Inputs
        [Enum.KeyCode.A, "A"],
        [Enum.KeyCode.B, "B"],
        [Enum.KeyCode.C, "C"],
        [Enum.KeyCode.D, "D"],
        [Enum.KeyCode.E, "E"],
        [Enum.KeyCode.F, "F"],
        [Enum.KeyCode.G, "G"],
        [Enum.KeyCode.H, "H"],
        [Enum.KeyCode.I, "I"],
        [Enum.KeyCode.J, "J"],
        [Enum.KeyCode.K, "K"],
        [Enum.KeyCode.L, "L"],
        [Enum.KeyCode.M, "M"],
        [Enum.KeyCode.N, "N"],
        [Enum.KeyCode.O, "O"],
        [Enum.KeyCode.P, "P"],
        [Enum.KeyCode.Q, "Q"],
        [Enum.KeyCode.R, "R"],
        [Enum.KeyCode.S, "S"],
        [Enum.KeyCode.T, "T"],
        [Enum.KeyCode.U, "U"],
        [Enum.KeyCode.V, "V"],
        [Enum.KeyCode.W, "W"],
        [Enum.KeyCode.X, "X"],
        [Enum.KeyCode.Y, "Y"],
        [Enum.KeyCode.Z, "Z"],

        [Enum.KeyCode.Space, "Space"],
        [Enum.KeyCode.LeftShift, "LeftShift"],
        [Enum.KeyCode.RightShift, "RightShift"],
        [Enum.KeyCode.LeftControl, "LeftCtrl"],
        [Enum.KeyCode.RightControl, "RightCtrl"],
        [Enum.KeyCode.LeftAlt, "LeftAlt"],
        [Enum.KeyCode.RightAlt, "RightAlt"],
        [Enum.KeyCode.Tab, "Tab"],
        [Enum.KeyCode.Return, "Enter"],
        [Enum.KeyCode.Backspace, "Backspace"],
        [Enum.KeyCode.Escape, "Escape"],

        // Function Keys
        [Enum.KeyCode.F1, "F1"],
        [Enum.KeyCode.F2, "F2"],
        [Enum.KeyCode.F3, "F3"],
        [Enum.KeyCode.F4, "F4"],
        [Enum.KeyCode.F5, "F5"],
        [Enum.KeyCode.F6, "F6"],
        [Enum.KeyCode.F7, "F7"],
        [Enum.KeyCode.F8, "F8"],
        [Enum.KeyCode.F9, "F9"],
        [Enum.KeyCode.F10, "F10"],
        [Enum.KeyCode.F11, "F11"],
        [Enum.KeyCode.F12, "F12"],

        // Arrow Keys
        [Enum.KeyCode.Left, "LeftArrow"],
        [Enum.KeyCode.Right, "RightArrow"],
        [Enum.KeyCode.Up, "UpArrow"],
        [Enum.KeyCode.Down, "DownArrow"],

        // Numpad
        [Enum.KeyCode.KeypadOne, "Numpad1"],
        [Enum.KeyCode.KeypadTwo, "Numpad2"],
        [Enum.KeyCode.KeypadThree, "Numpad3"],
        [Enum.KeyCode.KeypadFour, "Numpad4"],
        [Enum.KeyCode.KeypadFive, "Numpad5"],
        [Enum.KeyCode.KeypadSix, "Numpad6"],
        [Enum.KeyCode.KeypadSeven, "Numpad7"],
        [Enum.KeyCode.KeypadEight, "Numpad8"],
        [Enum.KeyCode.KeypadNine, "Numpad9"],
        [Enum.KeyCode.KeypadZero, "Numpad0"],

        // Xbox Controller Inputs
        [Enum.KeyCode.ButtonA, "A Button"],
        [Enum.KeyCode.ButtonB, "B Button"],
        [Enum.KeyCode.ButtonX, "X Button"],
        [Enum.KeyCode.ButtonY, "Y Button"],
        [Enum.KeyCode.ButtonR1, "R1"],
        [Enum.KeyCode.ButtonL1, "L1"],
        [Enum.KeyCode.ButtonR2, "R2"],
        [Enum.KeyCode.ButtonL2, "L2"],
        [Enum.KeyCode.ButtonR3, "R3"],
        [Enum.KeyCode.ButtonL3, "L3"],
        [Enum.KeyCode.DPadUp, "DPad Up"],
        [Enum.KeyCode.DPadDown, "DPad Down"],
        [Enum.KeyCode.DPadLeft, "DPad Left"],
        [Enum.KeyCode.DPadRight, "DPad Right"],

        // Thumbstick (Gamepad)
        [Enum.KeyCode.Thumbstick1, "Left Thumbstick"],
        [Enum.KeyCode.Thumbstick2, "Right Thumbstick"],

        // Touch and other UserInputTypes
        [Enum.UserInputType.Touch, "Touch"],
        [Enum.UserInputType.Keyboard, "Keyboard"],
        [Enum.UserInputType.Gamepad1, "Gamepad1"],
        [Enum.UserInputType.Gamepad2, "Gamepad2"],
        [Enum.UserInputType.Gamepad3, "Gamepad3"],
        [Enum.UserInputType.Gamepad4, "Gamepad4"],
    ]);

    // Create a reverse mapping to find enums from string keys
    const reverseMapping = new Map<string, Enum.UserInputType | Enum.KeyCode>();
    keyMapping.forEach((stringValue, enumKey) => {
        reverseMapping.set(stringValue, enumKey);
    });

    // Function to map an input to its string representation
    export function GetKeyString(input: Enum.UserInputType | Enum.KeyCode): string {
        const result = keyMapping.get(input);
        if (result) {
            return result;
        }
        throw `Unknown Key: ${tostring(input)}`;
    }

    // Function to map a string representation back to the Enum input
    export function GetEnumFromString(inputString: string): Enum.UserInputType | Enum.KeyCode {
        const result = reverseMapping.get(inputString);
        if (result) {
            return result;
        }
        throw `Unknown Input: ${inputString}`;
    }
}
