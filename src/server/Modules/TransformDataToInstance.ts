
interface Data {
    [key: string]: unknown,
}

function CreateInstanceFromValue(name: string, value: unknown): Instance | void{
    let valueInstance: undefined | Instance

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

    if (valueInstance){
        valueInstance.Name = name
        return valueInstance
    }
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
            const valueInstance: Instance | void = CreateInstanceFromValue(tostring(index), value);
            assert(valueInstance, `Undefined Instance Type Given: ${typeOf(value)}}`);
            valueInstance.Parent = folder; // Attach to folder
        }
    }
}


export default function TransformData(parentInstance: Instance, data: Data): void {
    
    for (const [index, value] of pairs(data)){
        if (!typeIs(value, 'table')) {
            const valueInstance: Instance | void = CreateInstanceFromValue(tostring(index),value)
            assert(valueInstance,`Undefined Instance Type Given: ${typeOf(value)}}`)
            valueInstance.Parent = parentInstance
        } else {
            CreateInstanceFromTable(tostring(index), value, parentInstance)
        }
    }
}