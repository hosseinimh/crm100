import { TICKETS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Ticket extends Entity {
    constructor() {
        super();
    }

    async paginateUser(_pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_TICKETS, {
            _pn,
            _pi,
        });
    }

    async paginateAdmin(unitId, _pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_TICKETS + "/" + unitId, {
            _pn,
            _pi,
        });
    }

    async getUser(id) {
        return await this.handlePost(API_URLS.FETCH_USER_TICKET + "/" + id);
    }

    async getAdmin(id) {
        return await this.handlePost(API_URLS.FETCH_ADMIN_TICKET + "/" + id);
    }

    async storeUser(type, subject, content, file) {
        let data = new FormData();

        data.append("type", type);
        data.append("subject", subject);
        data.append("content", content);
        data.append("file", file);

        return await this.handlePostFile(API_URLS.STORE_TICKET, data);
    }

    async storeAdmin(unitId, type, subject, content) {
        return await this.handlePost(API_URLS.STORE_TICKET + "/" + unitId, {
            type,
            subject,
            content,
        });
    }

    async storeThreadUser(ticketId, content, file) {
        let data = new FormData();

        data.append("content", content);
        data.append("file", file);

        return await this.handlePostFile(
            API_URLS.STORE_TICKET_THREAD_USER + "/" + ticketId,
            data
        );
    }

    async storeThreadAdmin(ticketId, content) {
        return await this.handlePost(
            API_URLS.STORE_TICKET_THREAD_ADMIN + "/" + ticketId,
            {
                content,
            }
        );
    }

    async seen(id) {
        return await this.handlePost(API_URLS.SEEN_TICKET + "/" + id);
    }

    async changeStatus(id) {
        return await this.handlePost(API_URLS.CHANGE_STATUS_TICKET + "/" + id);
    }
}
