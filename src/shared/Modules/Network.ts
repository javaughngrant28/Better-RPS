import { Players, RunService, ReplicatedStorage } from "@rbxts/services";

const NO_LISTENER_WARNING = "Nothing listening to %s";

// Create or fetch the RemoteEvent and RemoteFunction dynamically
function getOrCreateRemote<T extends Instance>(
    parent: Instance,
    className: keyof CreatableInstances,
    name: string,
): T {
    let remote = parent.FindFirstChild(name) as T;
    if (!remote) {
        remote = new Instance(className) as unknown as T;
        remote.Name = name;
        remote.Parent = parent;
    }
    return remote;
}

// Dynamically create or get the remotes
const sendData = getOrCreateRemote<RemoteEvent>(ReplicatedStorage, "RemoteEvent", "SendData");
const getData = getOrCreateRemote<RemoteFunction>(ReplicatedStorage, "RemoteFunction", "GetData");

// Listener type definition
export interface Listener {
    Command: string;
    Callback: (player?: Player, ...args: unknown[]) => unknown;
    StopListening: () => void;
}

const listeners: Listener[] = [];

const RemoteMessenger = {
    // Add a listener to handle specific commands
    AddListener(commandName: string, func: Listener["Callback"]): Listener {
        const listener: Listener = {
            Command: commandName,
            Callback: func,
            StopListening() {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.remove(index);
                }
            },
        };

        listeners.push(listener);
        return listener;
    },

    // Send a command to the server
    SendServer(cmd: string, ...args: unknown[]) {
        sendData.FireServer(cmd, ...args);
    },

    // Send a command to a specific client
    SendClient(player: Player, cmd: string, ...args: unknown[]) {
        sendData.FireClient(player, cmd, ...args);
    },

    // Send a command to all clients
    SendAllClients(cmd: string, ...args: unknown[]) {
        sendData.FireAllClients(cmd, ...args);
    },

    // Request a value from the server
    GetFromServer(cmd: string, ...args: unknown[]): unknown {
        return getData.InvokeServer(cmd, ...args);
    },

    // Request a value from a specific client
    GetFromClient(player: Player, cmd: string, ...args: unknown[]): unknown {
        return getData.InvokeClient(player, cmd, ...args);
    },

    // Server receives commands
    _ServerReceive(player: Player, cmd: string, ...args: unknown[]) {
        for (const listener of listeners) {
            if (listener.Command === cmd) {
                return listener.Callback(player, ...(args as unknown[]));
            }
        }
        warn(string.format(NO_LISTENER_WARNING, cmd));
    },

    // Client receives commands
    _ClientReceive(cmd: string, ...args: unknown[]) {
        for (const listener of listeners) {
            if (listener.Command === cmd) {
                // Explicitly cast `args` to align with the callback's expected parameters
                return listener.Callback(...(args as [Player, ...unknown[]]));
            }
        }
        warn(string.format(NO_LISTENER_WARNING, cmd));
    }

};

// Initialize the remotes on the server or client
if (RunService.IsServer()) {
    sendData.OnServerEvent.Connect((player, cmd, ...args) => {
        RemoteMessenger._ServerReceive(player, cmd as string, ...args);
    });

    getData.OnServerInvoke = (player, cmd, ...args) => {
        return RemoteMessenger._ServerReceive(player, cmd as string, ...args);
    };
} else if (RunService.IsClient()) {
    sendData.OnClientEvent.Connect((cmd, ...args) => {
        RemoteMessenger._ClientReceive(cmd as string, ...args);
    });

    getData.OnClientInvoke = (cmd, ...args) => {
        return RemoteMessenger._ClientReceive(cmd as string, ...args);
    };
}

export default RemoteMessenger;
