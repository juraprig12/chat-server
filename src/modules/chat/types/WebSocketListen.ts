import { Message } from "./Message";

export interface ClientToServerListen {
    messageToServer: (message: Message) => void
}
export interface ServerToClientListen {
    messageToClient: (message: Message) => void
}

export interface ClientToServerListenCount {
    countMessageToServer: (message: Message) => void
}
export interface ServerToClientListenCount {
    countMessageToClient: (message: Message) => void
}