import { Message } from "./Message";

export interface ClientToServerListen {
    message: (message: Message) => void
}
export interface ServerToClientListen {
    message: (message: Message) => void
}

export interface ClientToServerListenCount {
    countMessage: (message: Message) => void
}
export interface ServerToClientListenCount {
    countMessage: (message: Message) => void
}