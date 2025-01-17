/* eslint-disable @typescript-eslint/no-explicit-any */

/** 
 * 

               (          )                           )   (         )  
   (     (     )\ )    ( /(        *   )  (  (     ( /(   )\ )   ( /(  
 ( )\    )\   (()/(    )\()) (   ` )  /(  )\))(   ')\()) (()/(   )\()) 
 )((_)((((_)(  /(_))  ((_)\  )\   ( )(_))((_)()\ )((_)\   /(_))|((_)\  
((_)_  )\ _ )\(_))_    _((_)((_) (_(_()) _(())\_)() ((_) (_))  |_ ((_) 
 | _ ) (_)_\(_)|   \  | \| || __||_   _| \ \((_)/ // _ \ | _ \ | |/ /  
 | _ \  / _ \  | |) | | .` || _|   | |    \ \/\/ /| (_) ||   /   ' <   
 |___/ /_/ \_\ |___/  |_|\_||___|  |_|     \_/\_/  \___/ |_|_\  _|\_\  
                                                                       
                                                                                                                                                                                                                                                          

 * A lightweight and powerful networking module for Roblox TS.
 *
 * Features:
 * - Single RemoteEvent for all communication (with optional namespaces).
 * - Namespace support: Isolate events and validate methods.
 * - Auto-cleanup with `.Destroy()` to prevent memory leaks.
 * - Timeout for waiting on RemoteEvent creation (default: 10 seconds).
 * - Warnings for unhandled events to help with debugging.
 *
 * Server API:
 * - `new NetworkServer(namespace?: string, methods?: string[])`: Creates a server instance.
 * - `.Fire(player: Player, method: string, ...args)`: Sends an event to a specific player.
 * - `.FireAll(method: string, ...args)`: Sends an event to all players.
 * - `.FireList(players: Player[], method: string, ...args)`: Sends an event to a list of players.
 * - `.On(method: string, callback: (player: Player, ...args) => void)`: Listens to an event.
 * - `.Destroy()`: Cleans up all connections.

 * Client API:
 * - `new NetworkClient(namespace?: string)`: Creates a client instance.
 * - `.Fire(method: string, ...args)`: Sends an event to the server.
 * - `.On(method: string, callback: (...args) => void)`: Listens to an event.
 * - `.Destroy()`: Cleans up all connections.
 */


import { ReplicatedStorage, Players, RunService } from "@rbxts/services";

const DEFAULT_REMOTE_EVENT_NAME = "NetworkRemoteEvent";
const REMOTE_WAIT_TIMEOUT = 10;

function getOrCreateRemoteEvent(eventName: string): RemoteEvent {
    let remoteEvent = ReplicatedStorage.FindFirstChild(eventName) as RemoteEvent | undefined;
    if (!remoteEvent) {
        remoteEvent = new Instance("RemoteEvent");
        remoteEvent.Name = eventName;
        remoteEvent.Parent = ReplicatedStorage;
    }
    return remoteEvent;
}

function waitForRemoteEvent(eventName: string): RemoteEvent {
    const remoteEvent = ReplicatedStorage.WaitForChild(eventName, REMOTE_WAIT_TIMEOUT) as RemoteEvent | undefined;
    if (!remoteEvent) {
        throw `RemoteEvent "${eventName}" did not appear within ${REMOTE_WAIT_TIMEOUT} seconds.`;
    }
    return remoteEvent;
}

// NetworkServer class
class NetworkServer {
    private remoteEvent: RemoteEvent;
    private namespace?: string;
    private methods?: string[];
    private connections: RBXScriptConnection[] = [];

    constructor(namespace?: string, methods?: string[]) {
        if (namespace && (!methods || methods.size() === 0)) {
            throw "If a namespace is provided, at least one method must be defined.";
        }
        this.namespace = namespace;
        this.methods = methods;
        const eventName = namespace ? `${DEFAULT_REMOTE_EVENT_NAME}_${namespace}` : DEFAULT_REMOTE_EVENT_NAME;
        this.remoteEvent = getOrCreateRemoteEvent(eventName);
    }

    Fire(player: Player, method: string, ...args: unknown[]) {
        if (this.namespace && this.methods && !this.methods.includes(method)) {
            throw `Method "${method}" is not defined in the namespace "${this.namespace}".`;
        }
        this.remoteEvent.FireClient(player, method, ...args);
    }

    FireAll(method: string, ...args: unknown[]) {
        if (this.namespace && this.methods && !this.methods.includes(method)) {
            throw `Method "${method}" is not defined in the namespace "${this.namespace}".`;
        }
        this.remoteEvent.FireAllClients(method, ...args);
    }

    FireList(players: Player[], method: string, ...args: unknown[]) {
        if (this.namespace && this.methods && !this.methods.includes(method)) {
            throw `Method "${method}" is not defined in the namespace "${this.namespace}".`;
        }
        for (const player of players) {
            this.remoteEvent.FireClient(player, method, ...args);
        }
    }

    On(method: string, callback: (player: Player, ...args: unknown[]) => void) {
        if (this.namespace && this.methods && !this.methods.includes(method)) {
            throw `Method "${method}" is not defined in the namespace "${this.namespace}".`;
        }
        const connection = this.remoteEvent.OnServerEvent.Connect((player, receivedMethod, ...args) => {
            if (receivedMethod === method) {
                callback(player, ...args);
            }
        });
        this.connections.push(connection);
    }

    Destroy() {
        for (const connection of this.connections) {
            connection.Disconnect();
        }
        this.connections.clear();
        print(`NetworkServer for namespace "${this.namespace ?? "default"}" has been cleaned up.`);
    }
}

// NetworkClient class
class NetworkClient {
    private remoteEvent: RemoteEvent;
    private namespace?: string;
    private connections: RBXScriptConnection[] = [];

    constructor(namespace?: string) {
        this.namespace = namespace;
        const eventName = namespace ? `${DEFAULT_REMOTE_EVENT_NAME}_${namespace}` : DEFAULT_REMOTE_EVENT_NAME;
        this.remoteEvent = waitForRemoteEvent(eventName);
    }

    Fire(method: string, ...args: unknown[]) {
        this.remoteEvent.FireServer(method, ...args);
    }

    On(method: string, callback: (...args: unknown[]) => void) {
        const connection = this.remoteEvent.OnClientEvent.Connect((receivedMethod, ...args) => {
            // Check if receivedMethod is a string
            if (typeIs(receivedMethod, "string") && receivedMethod === method) {
                // Verify if args is a table (array in Roblox terms)
                if (typeIs(args, "table")) {
                    callback(...(args as unknown[]));
                } else {
                    warn("Received arguments are not a valid array.");
                }
            } else {
                warn(`No listener is attached for method "${receivedMethod}" on namespace "${this.namespace ?? "default"}".`);
            }
        });
        this.connections.push(connection);
    }




    Destroy() {
        for (const connection of this.connections) {
            connection.Disconnect();
        }
        this.connections.clear();
        print(`NetworkClient for namespace "${this.namespace ?? "default"}" has been cleaned up.`);
    }
}

// Export the module
export = {
    NetworkServer,
    NetworkClient,
};
