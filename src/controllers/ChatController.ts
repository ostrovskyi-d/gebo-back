import {Server, Socket} from 'socket.io';
import log from "../heplers/logger";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

let ioSocket: Socket;

class ChatController {
    private readonly io: Server<DefaultEventsMap, DefaultEventsMap>;

    constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
        this.io = io;
    }

    public init() {
        this.io.on('connection', (socket: Socket) => {
            ioSocket = socket;
            this._useSocketListeners();
        })

        return this.io;
    }

    private _useSocketListeners = () => this._withSocket((socket: Socket) => {
        if (socket) {
            socket.emit('success', 'Hello');
            socket.on('message', this.onMessage);
            socket.on('typing', this.onTyping);


            socket.on('disconnect', this.onDisconnect);
        }
    });

    private _withSocket = (cb: Function) => ioSocket ? cb(ioSocket) : null;

    private onTyping = () => this._withSocket((socket: Socket) => {
        log.info('User is typing message...');

        socket.emit('typing', 'User is typing message...');
    })

    private onMessage = (message: String) => this._withSocket((socket: Socket) => {
        log.info(`User sent message: ${message}`);

        socket.emit('message received', message + ' received')
    })

    private onDisconnect = () => this._withSocket((socket: Socket) => {
        log.info('Socket disconnected by user');

        socket.disconnect();
        this.io.close();
    });
}

export default ChatController;
