import { ReplicatedStorage } from "@rbxts/services"
import { Janitor } from "@rbxts/janitor"
import FuncLib from "shared/Modules/FuncLib"

export type DataFromClient = Record<string, unknown>
type Attributes = { [name: string]: string | boolean | number }

export class InputConnection {
    private player: Player

    private janitor: Janitor<{
        Instances: Instance
        Connections: RBXScriptConnection
    }>

    private keybindName: string
    private inputModule: Instance

    private attributes: Attributes

    public constructor(player: Player, keybindName: string, inputModuleName: string) {
        const inputModuleReffence: Instance | undefined = ReplicatedStorage.FindFirstChild('Shared')?.FindFirstChild(inputModuleName)
        assert(inputModuleReffence, `${inputModuleName} Module Not Found`)

        this.player = player
        this.keybindName = keybindName
        this.inputModule = inputModuleReffence

        this.attributes = {
            keybindName: keybindName,
            CreateButton: true,
            CoolDown: 2,
        }

        this.janitor = this.janitor = new Janitor<{
            Instances: Instance
            Connections: RBXScriptConnection
        }>()
    }

    public SetInputAttributes(attributes: Attributes) {
        for (const [key, value] of pairs(attributes)) {
            this.attributes[key] = value
        }
    }

    public SetCreateButtonAttribute(value: boolean) {
        this.attributes.CreateButton = value
    }

    public SetCoolDownAttribute(value: number) {
        this.attributes.CoolDown = value
    }

    public ConnectToCallback(callback: (player: Player, data: DataFromClient) => void) {
        let folder = ReplicatedStorage.FindFirstChild('InputEvents')

        if (!folder) {
            folder = new Instance('Folder')
            folder.Name = 'InputEvents'
            folder.Parent = ReplicatedStorage
        }

        const remote = new Instance('RemoteEvent')
        remote.Name = this.keybindName
        remote.Parent = folder
        this.janitor.Add(remote, "Destroy")

        const module: Instance = this.inputModule.Clone()
        FuncLib.SetAttributes(module, this.attributes)

        const connection = remote.OnServerEvent.Connect((player, data) => {
            callback(player, data as DataFromClient)
        })

        this.janitor.Add(connection, "Disconnect");
    }

    public Destroy() {
        this.janitor.Cleanup()
    }
}