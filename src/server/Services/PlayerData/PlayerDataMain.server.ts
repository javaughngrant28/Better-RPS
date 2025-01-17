import { Players } from "@rbxts/services";
import DefaultValues from "./DefaultData";
import TransformData from "server/Modules/TransformDataToInstance";



Players.PlayerAdded.Connect((player: Player) => {
    print(DefaultValues.instances)
    TransformData(player, DefaultValues.instances)
})