
interface Data {
    [key: string]: unknown,
}

function CreateInstanceFromValue(name: string, value: unknown, parentInstance: Instance): void{
    let valueInstance: undefined | ValueBase

    if (typeIs(value,'boolean')){
        valueInstance = new Instance('BoolValue')
    }

    if (typeIs(value, 'number')){
        valueInstance = new Instance('NumberValue')
    }

    if (typeIs(value, 'string')){
        valueInstance = new Instance('StringValue')
    }

    if (typeIs(value, 'Vector3')){
        valueInstance = new Instance('Vector3Value')
    }

    assert(valueInstance, `Undefined Instance Type Given: ${typeOf(value)}}`)
    valueInstance.Name = name
    valueInstance.Value = value
    valueInstance.Parent = parentInstance
}

function CreateInstanceFromTable(name: string, dataTable: unknown, parentInstance: Instance): void {
    const folder = new Instance("Folder");
    folder.Name = name;
    folder.Parent = parentInstance;

    if (!typeIs(dataTable,'table')){
        return
    }

    for (const [index, value] of pairs(dataTable)) {
        if (typeIs(value, "table")) {
            CreateInstanceFromTable(tostring(index), value, folder); // Use folder as parent
        } else {
            CreateInstanceFromValue(tostring(index), value, folder);
           
        }
    }
}


export default function TransformData(parentInstance: Instance, data: Data): void {
    
    for (const [index, value] of pairs(data)){
        if (!typeIs(value, 'table')) {
         CreateInstanceFromValue(tostring(index),value,parentInstance)
        } else {
            CreateInstanceFromTable(tostring(index), value, parentInstance)
        }
    }
}