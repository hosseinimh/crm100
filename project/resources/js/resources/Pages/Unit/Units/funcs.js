import { useSelector } from "react-redux";

import { basePath, MESSAGE_CODES, MESSAGE_TYPES } from "../../../../constants";
import { general, unitsPage as strings } from "../../../../constants/strings";
import { Department, Unit as Entity } from "../../../../http/entities";
import {
    setLoadingAction,
    setPagePropsAction,
    setTitleAction,
} from "../../../../state/layout/layoutActions";
import { setMessageAction } from "../../../../state/message/messageActions";

let _dispatch;
let _navigate;
let _ls;
let _departmentId;
let _entity = new Entity();

export const init = (dispatch, navigate) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _ls = useSelector((state) => state.layoutReducer);
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setDepartmentId(params?.departmentId);
    _dispatch(
        setPagePropsAction({
            departmentId: null,
            item: null,
            items: null,
            action: null,
        })
    );

    fillForm();
};

export const onLayoutState = () => {
    if (_ls?.pageProps === null) {
        return;
    }

    let { action } = _ls?.pageProps;

    if (_ls?.pageProps?.action) {
        _dispatch(setPagePropsAction({ action: null }));
    }

    switch (action) {
        case "ADD":
            addAction();

            return;
        case "EDIT":
            editAction(_ls?.pageProps?.item);

            return;
        case "DOCUMENTS":
            documentsAction(_ls?.pageProps?.item);

            return;
        case "USERS":
            usersAction(_ls?.pageProps?.item);

            return;
        case "TICKETS":
            ticketsAction(_ls?.pageProps?.item);

            return;
    }
};

export const onAdd = () => {
    _dispatch(setPagePropsAction({ action: "ADD" }));
};

export const onEdit = (item) => {
    _dispatch(
        setPagePropsAction({
            action: "EDIT",
            item,
        })
    );
};

export const onDocuments = (item) => {
    _dispatch(
        setPagePropsAction({
            action: "DOCUMENTS",
            item,
        })
    );
};

export const onUsers = (item) => {
    _dispatch(
        setPagePropsAction({
            action: "USERS",
            item,
        })
    );
};

export const onTickets = (item) => {
    _dispatch(
        setPagePropsAction({
            action: "TICKETS",
            item,
        })
    );
};

const setDepartmentId = (departmentId) => {
    _departmentId = !isNaN(departmentId) && departmentId > 0 ? departmentId : 0;
};

const addAction = () => {
    _navigate(`${basePath}/units/add/${_departmentId}`);
};

const editAction = (item) => {
    if (!isNaN(item?.id) && item?.id > 0) {
        _navigate(`${basePath}/units/edit/${item.id}`);
    }
};

const documentsAction = (item) => {
    if (!isNaN(item?.id) && item?.id > 0) {
        _navigate(`${basePath}/documents/${item.id}`);
    }
};

const usersAction = (item) => {
    if (!isNaN(item?.id) && item?.id > 0) {
        _navigate(`${basePath}/users/${item.id}`);
    }
};

const ticketsAction = (item) => {
    if (!isNaN(item?.id) && item?.id > 0) {
        _navigate(`${basePath}/tickets/${item.id}`);
    }
};

const fillForm = async (data = null) => {
    _dispatch(setLoadingAction(true));

    await fetchDepartment();
    await fetchUnits(data);

    _dispatch(setLoadingAction(false));
};

const fetchDepartment = async () => {
    if (_departmentId <= 0) {
        _dispatch(
            setMessageAction(
                general.itemNotFound,
                MESSAGE_TYPES.ERROR,
                MESSAGE_CODES.ITEM_NOT_FOUND,
                false
            )
        );
        _navigate(`${basePath}/organizations`);

        return null;
    }

    const department = new Department();
    let result = await department.get(_departmentId);

    if (result === null) {
        _dispatch(
            setMessageAction(
                general.itemNotFound,
                MESSAGE_TYPES.ERROR,
                MESSAGE_CODES.ITEM_NOT_FOUND,
                false
            )
        );
        _navigate(`${basePath}/organizations`);

        return null;
    }

    _dispatch(setPagePropsAction({ department: result?.item }));
    _dispatch(setTitleAction(`${strings._title} [ ${result?.item?.title} ]`));
};

const fetchUnits = async (data = null) => {
    let result = await _entity.paginate(_departmentId);

    if (result === null) {
        _dispatch(setPagePropsAction({ items: null }));
        _dispatch(
            setMessageAction(
                _entity.errorMessage,
                MESSAGE_TYPES.ERROR,
                _entity.errorCode
            )
        );

        return;
    }

    _dispatch(setPagePropsAction({ items: result.items }));
};
