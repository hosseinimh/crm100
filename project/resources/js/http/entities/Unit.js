import { UNITS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Unit extends Entity {
    constructor() {
        super();
    }

    async paginate(unitId, _pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_UNITS + "/" + unitId, {
            _pn,
            _pi,
        });
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_UNIT + "/" + id);
    }

    async store(unitId, title) {
        return await this.handlePost(API_URLS.STORE_UNIT + "/" + unitId, {
            title,
        });
    }

    async update(id, title) {
        return await this.handlePost(API_URLS.UPDATE_UNIT + "/" + id, {
            title,
        });
    }
}
