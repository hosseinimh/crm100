import { DEPARTMENTS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Department extends Entity {
    constructor() {
        super();
    }

    async paginate(organizationId, _pn = 1, _pi = 10) {
        return await this.handlePost(
            API_URLS.FETCH_DEPARTMENTS + "/" + organizationId,
            {
                _pn,
                _pi,
            }
        );
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_DEPARTMENT + "/" + id);
    }

    async store(organizationId, title) {
        return await this.handlePost(
            API_URLS.STORE_DEPARTMENT + "/" + organizationId,
            {
                title,
            }
        );
    }

    async update(id, title) {
        return await this.handlePost(API_URLS.UPDATE_DEPARTMENT + "/" + id, {
            title,
        });
    }
}
