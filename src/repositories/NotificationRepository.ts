import Notifications, { INotification } from "src/models/notification";
import { BaseRepository } from "./BaseRepository";
import Hostels, { IHostel } from "src/models/hostel";

@Service()
class NotificationRepository extends BaseRepository<INotification>{
    constructor(){
        super(Notifications)
    }
}

export default NotificationRepository