import { useSelector } from "react-redux";

import { basePath, MESSAGE_CODES, MESSAGE_TYPES } from "../../../../constants";
import {
    general,
    departmentsPage as strings,
} from "../../../../constants/strings";
import { Organization, Department as Entity } from "../../../../http/entities";
import {
    setLoadingAction,
    setPagePropsAction,
    setTitleAction,
} from "../../../../state/layout/layoutActions";
import { setMessageAction } from "../../../../state/message/messageActions";

let _dispatch;
let _navigate;
let _ls;
let _organizationId;
let _entity = new Entity();

export const init = (dispatch, navigate) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _ls = useSelector((state) => state.layoutReducer);
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setOrganizationId(params?.organizationId);
    _dispatch(
        setPagePropsAction({
            organizationId: null,
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

const setOrganizationId = (organizationId) => {
    _organizationId =
        !isNaN(organizationId) && organizationId > 0 ? organizationId : 0;
};

const addAction = () => {
    _navigate(`${basePath}/departments/add/${_organizationId}`);
};

const editAction = (item) => {
    if (!isNaN(item?.id) && item?.id > 0) {
        _navigate(`${basePath}/departments/edit/${item.id}`);
    }
};

const fillForm = async (data = null) => {
    _dispatch(setLoadingAction(true));

    await fetchOrganization();
    await fetchDepartments(data);

    _dispatch(setLoadingAction(false));
};

const fetchOrganization = async () => {
    if (_organizationId <= 0) {
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

    const organization = new Organization();
    let result = await organization.get(_organizationId);

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

    _dispatch(setPagePropsAction({ organization: result?.item }));
    _dispatch(setTitleAction(`${strings._title} [ ${result?.item?.title} ]`));
};

const fetchDepartments = async (data = null) => {
    let result = await _entity.paginate(_organizationId);

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
