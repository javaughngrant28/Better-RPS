import { Players } from "@rbxts/services";
import DefaultValues from "./DefaultData";
import TransformData from "server/Modules/TransformDataToInstance";



Players.PlayerAdded.Connect((player: Player)=>{
    TransformData(player, DefaultValues.instances)
})