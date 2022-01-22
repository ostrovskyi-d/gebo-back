import {Request, Response} from 'express';
import log from "../heplers/logger";

class ChatController {
    async init(req: Request, res: Response) {
        log.info('Chat will be here...');
        //    todo: chat to be continued...
    }
}

export default ChatController;
