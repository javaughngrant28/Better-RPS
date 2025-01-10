import { Players } from "@rbxts/services";
import DefaultValues from "./DefaultData";
import TransformData from "shared/Modules/TransformDataToInstance";



Players.PlayerAdded.Connect((player: Player)=>{
    TransformData(player, DefaultValues.instances)
})