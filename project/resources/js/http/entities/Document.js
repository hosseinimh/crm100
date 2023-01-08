import { DOCUMENTS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Document extends Entity {
    constructor() {
        super();
    }

    async paginateUser(_pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_DOCUMENTS, {
            _pn,
            _pi,
        });
    }

    async paginateAdmin(unitId, _pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_DOCUMENTS + "/" + unitId, {
            _pn,
            _pi,
        });
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_DOCUMENT + "/" + id);
    }

    async store(unitId, title, description, file) {
        let data = new FormData();

        data.append("title", title);
        data.append("description", description);
        data.append("file", file);

        return await this.handlePostFile(
            API_URLS.STORE_DOCUMENT + "/" + unitId,
            data
        );
    }

    async update(id, title, description, file) {
        let data = new FormData();

        data.append("title", title);
        data.append("description", description);
        data.append("file", file);

        return await this.handlePostFile(
            API_URLS.UPDATE_DOCUMENT + "/" + id,
            data
        );
    }
}
