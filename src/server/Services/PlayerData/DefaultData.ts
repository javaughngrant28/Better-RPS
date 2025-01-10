
interface EquipedAbiliesInterface {
    [Melee: string]: string,
    Ranged: string,
    Evade: string
}

interface InstacesInterface {
    [Isloded: string]: boolean | EquipedAbiliesInterface,
    CanUseAbilities: boolean,
    EquipedAbilities: EquipedAbiliesInterface
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
        }
    },

    data: {
        Wins: 0,
    }

} as DefaultDataInterface


export default DefaultData
