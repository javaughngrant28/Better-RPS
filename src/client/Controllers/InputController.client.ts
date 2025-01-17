
/*
    Input controller.
    SET UP:
        - Requires Keymapper Module
        - Create Input Folder: Add A Folder In Player Called "Input"
        - Create Key Binds Folder: Add A Folder Into The Player Called "Keybinds"
        - Create A Key Bind:
            Keybinds = {
                Attack = {
                    PC =  'M1',
                    Xbox = 'R1',
                },
        - Create A Input Type Object Texteding The Abstract Class
	
    HOW To USE:
        - Give The Module Attributes: keybindName = "Attack", Cooldown = 0.8, CreateButton = True / False
        - Add The Module To Input Folder
    	
        *NOTE: 
        - If CreateButton Is Set To True Then You Must Provide A Image Button As A Reffence: YourModuleName.GetButtonReffence = Button
        this controller will copy some of the properties of the button and all it's childern intances

        - Add A String Intance Named "UpdateImage" If You And To Have A Toogle Functionality
 */

import { ContextActionService, Players } from "@rbxts/services"
import { KeyMapper } from "shared/Data/KeyMapper"
import { InputTypeInterface } from "shared/InputTypes/AbstractInputType"


type KeyBindValues = {
    PC: StringValue,
    Xbox: StringValue
}

const player: Player = Players.LocalPlayer
const playerGui: PlayerGui = player.FindFirstChildOfClass('PlayerGui')!

const InputFolder = player.WaitForChild('Input', 30) as Folder
assert(InputFolder, `Input Folder Not Found: ${player}`)

const KeybindFolder = player.WaitForChild('Keybinds', 30) as Folder
assert(KeybindFolder, `Keybind Folder Not Found: ${player}`)

const requiredModules: Map<string, InputTypeInterface> = new Map()
const contextConectionNames: Map<string, string> = new Map()


function TransferButtonPropertiesAndChildren(buttonRefference: ImageButton, defaultButton: ImageButton) {
    const properties: Array<keyof ImageButton> = [
        "Size", "Position", "AnchorPoint", "BackgroundColor3",
        "BackgroundTransparency", "Image", "ImageRectOffset", "ImageRectSize",
        "Visible", "ZIndex", "BorderSizePixel", "Name"
    ];

    properties.forEach((property) => {
        const [success, value] = pcall(() => buttonRefference[property]);

        if (success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (defaultButton as any)[property] = value;
        }
    });

    const children: Instance[] = buttonRefference.GetChildren()
    children.forEach((child: Instance) => {
        const clone = child.Clone()
        clone.Parent = defaultButton
    })
}



function ConnectToInputModule(module: Instance) {
    if (!classIs(module, 'ModuleScript')) return

    const attributes: Map<string, AttributeValue> = module.GetAttributes()
    const actionName = attributes.get('ActionName') as string
    const coolDown = attributes.get('Cooldown') as number
    const createButtonForMobile = attributes.get('CreateButtonForMobile') as boolean

    assert(coolDown, `Cooldown Attribut Not Assigned ${module}`)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const moduleContects = require(module) as InputTypeInterface

    requiredModules.set(module.Name, moduleContects)
    const inputModule = requiredModules.get(module.Name) as InputTypeInterface


    const folder = KeybindFolder.FindFirstChild(actionName)
    assert(folder, `KeyBind Folder Not Found For Action: ${actionName}`)

    const children = folder.GetChildren()
    const keybindValues: KeyBindValues = {
        PC: children.find((child) => child.Name === "PC") as StringValue,
        Xbox: children.find((child) => child.Name === "Xbox") as StringValue,
    };

    assert(keybindValues.PC, "PC keybind not found in folder")
    assert(keybindValues.Xbox, "Xbox keybind not found in folder")

    const xboxValue: StringValue = keybindValues.Xbox
    const pcValue: StringValue = keybindValues.PC

    const xbox: Enum.UserInputType | Enum.KeyCode = KeyMapper.GetEnumFromString(xboxValue.Value)
    const pc: Enum.UserInputType | Enum.KeyCode = KeyMapper.GetEnumFromString(pcValue.Value)

    ContextActionService.BindAction(actionName, inputModule.Activate, createButtonForMobile, xbox, pc)
    contextConectionNames.set(module.Name, actionName)

    if (!createButtonForMobile) return

    const mobileButton = ContextActionService.GetButton(actionName) as ImageButton
    if (!mobileButton) return

    assert(inputModule.GetButtonReffence, `GetButtonReffence Method Not Found: ${module}`)

    const buttonRefference: ImageButton = inputModule.GetButtonReffence()
    TransferButtonPropertiesAndChildren(buttonRefference, mobileButton)


    const imageValue = mobileButton.FindFirstChild('UpdateImage') as StringValue | void

    function UpdateImage() {
        if (imageValue) {
            mobileButton.Image = imageValue.Value
        } else {
            mobileButton.Image = buttonRefference.Image
        }
    }

    mobileButton.GetPropertyChangedSignal("Image").Connect(() => {
        if (mobileButton.Image === buttonRefference.Image) return
        if (imageValue && mobileButton.Image === imageValue.Value) return
        UpdateImage()
    })
}

function DisconnectInputModule(module: Instance) {
    if (!classIs(module, "ModuleScript")) return

    const moduleName: string = module.Name
    const contextActionName: string | void = contextConectionNames.get(module.Name)

    if (!requiredModules.get(moduleName)) return
    requiredModules.delete(moduleName)

    if (!contextActionName) return
    ContextActionService.UnbindAction(contextActionName)
    contextConectionNames.delete(contextActionName)
}

function SetContextActionGui(screenGui: Instance) {
    if (screenGui.Name !== 'ContextActionGui') return

    const frame = screenGui.WaitForChild('ContextButtonFrame', 10) as Frame | undefined;
    if (!frame) return

    frame.Size = UDim2.fromScale(1, 1)
    frame.Position = UDim2.fromScale(0, 0)
}


playerGui.ChildAdded.Connect(SetContextActionGui)
InputFolder.ChildAdded.Connect(ConnectToInputModule)
InputFolder.ChildRemoved.Connect(DisconnectInputModule)


InputFolder.GetChildren().forEach((module) => {
    if (classIs(module, 'ModuleScript')) {
        ConnectToInputModule(module)
    }
})

playerGui.GetChildren().forEach((gui) => {
    if (classIs(gui, 'ScreenGui')) {
        SetContextActionGui(gui)
    }
})