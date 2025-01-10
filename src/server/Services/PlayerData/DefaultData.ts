type Data = string | boolean | number | Vector3

interface NestedData{
    [key: string]: Data | Record<string, Data>
}

interface KeyBindInterface{
    [key: string]: {
        PC: string;
        Xbox: string;
    }
}

interface EquipedAbiliesInterface {
    [Melee: string]: string,
    Ranged: string,
    Evade: string
}

interface InstacesInterface {
    [Isloded: string]: Data | NestedData,
    CanUseAbilities: boolean,
    EquipedAbilities: EquipedAbiliesInterface,
    KeyBinds: KeyBindInterface,
}

interface DataInterface {
    [Wins: string]: number
}

interface DefaultDataInterface {
    instances: InstacesInterface,
    data: DataInterface
}


const DefaultData = {
    instances: {
        Isloded: true,
        CanUseAbilities: true,
        EquipedAbilities: {
            Melee: 'Box',
            Ranged: 'Brick',
            Evade: 'Zoom'
        },
        KeyBinds: {
            Evade: {
                PC: "Q",
                Xbox: "Button A"
            }
        }
    },

    data: {
        Wins: 0,
    }

} as DefaultDataInterface


export default DefaultData
