import {Server, Socket} from 'socket.io';
import log from "../../heplers/logger";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import EVENTS from '../../consts/ioEvents';
import chatHandlers from "./ChatHandlers";
import Conversation from "../../models/Conversation";
import {Request, Response} from "express";

let ioSocket: Socket;

class ChatController {
    private readonly io: Server<DefaultEventsMap, DefaultEventsMap>;
    private userID: any | null;
    static initConversation: Function;

    constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
        this.io = io;
        this.userID = null;
    }

    public initConversation = async (req: Request, res: Response) => {
        const {body} = req;
        const {senderId, receiverId}: any = body;
        const newConversation = new Conversation({
            members: [senderId, receiverId]
        });

        try {
            const savedConversation = await newConversation.save();
            log.info('Conversation saved successfully')
            res.status(200).json(savedConversation);
        } catch (err) {
            res.status(500).json(err);
        }
    };

    public getUserConversation = async (req: Request, res: Response) => {
        try {
            const conversation = await Conversation.find({
                members: {$in: [req.params.userId]}
            });

            res.status(200).json(conversation);
        } catch (err) {
            res.status(500).json(err)
        }
    }

    public init = () => {

        this.io.on(EVENTS.CONNECTION, (socket: Socket) => {
            ioSocket = socket;
            this.userID = socket.handshake.query.user;

            // this._useSocketListeners();
        })

        return this;
    }
    //
    // private _useSocketListeners = () => this._withSocket(async (socket: Socket) => {
    //     if (socket) {
    //         socket.emit(EVENTS.SUCCESS, await chatHandlers.findUserMessages(this.userID));
    //
    //         socket.on(EVENTS.MESSAGE, this.onMessage);
    //         socket.on(EVENTS.TYPING, this.onTyping);
    //
    //
    //         socket.on(EVENTS.DISCONNECT, this.onDisconnect);
    //     }
    // });
    //
    //
    // private _withSocket = (cb: Function) => ioSocket ? cb(ioSocket) : null;
    //
    // private onTyping = () => this._withSocket((socket: Socket) => {
    //     log.info('User is typing message...');
    //
    //     socket.emit(EVENTS.TYPING, 'User is typing message...');
    // })
    //
    // private onMessage = (message: Object) => this._withSocket(async (socket: Socket) => {
    //     log.info(`User sent message: ${JSON.stringify(message)}`);
    //
    //     const {content, userName, user}: any = message;
    //     await chatHandlers.saveUserMessage(message);
    //
    //     socket.emit(EVENTS.MESSAGE, message + ' received')
    // })
    //
    // private onDisconnect = () => this._withSocket((socket: Socket) => {
    //     log.info('Socket disconnected by user');
    //
    //     socket.disconnect();
    //     // this.io.close();
    // });
}

export default ChatController;
