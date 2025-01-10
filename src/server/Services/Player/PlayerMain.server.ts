/*
    The player should get abilities to start out
    > Speed
*/

import { Players } from "@rbxts/services";

function onCharacterAdded(player: Player,character: Model){
    print(`Character Added: ${character}'`)
    
}

function onPlayerJoin(player: Player){
    print(`Player Added: ${player}`)
    player.CharacterAdded.Connect((character: Model) => onCharacterAdded(player,character))
}

Players.PlayerAdded.Connect(onPlayerJoin)