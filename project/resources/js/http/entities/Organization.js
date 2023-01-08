import { ORGANIZATIONS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Organization extends Entity {
    constructor() {
        super();
    }

    async paginate(_pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_ORGANIZATIONS, {
            _pn,
            _pi,
        });
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_ORGANIZATION + "/" + id);
    }

    async store(title) {
        return await this.handlePost(API_URLS.STORE_ORGANIZATION, {
            title,
        });
    }

    async update(id, title) {
        return await this.handlePost(API_URLS.UPDATE_ORGANIZATION + "/" + id, {
            title,
        });
    }
}
