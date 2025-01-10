
interface InstacesInterface {
    [isloded: string]: boolean 
}

interface DataInterface {
    [wins: string]: number
}

interface DefaultDataInterface {
    instances: InstacesInterface,
    data: DataInterface
}


const DefaultData = {
    instances: {
        isloded: true,
    },

    data: {
        wins: 0,
    }

} as DefaultDataInterface


export default DefaultData
