import { Service } from "typedi";
import Notifications, { INotification } from "../models/notification";
import { BaseRepository } from "./BaseRepository";


@Service()
class NotificationRepository extends BaseRepository<INotification>{
    constructor(){
        super(Notifications)
    }
}

export default NotificationRepository