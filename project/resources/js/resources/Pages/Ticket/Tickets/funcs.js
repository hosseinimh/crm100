import { useSelector } from "react-redux";

import {
    basePath,
    MESSAGE_CODES,
    MESSAGE_TYPES,
    USER_ROLES,
} from "../../../../constants";
import { general, ticketsPage as strings } from "../../../../constants/strings";
import { Unit, Ticket as Entity } from "../../../../http/entities";
import {
    setLoadingAction,
    setPagePropsAction,
    setTitleAction,
} from "../../../../state/layout/layoutActions";
import { setMessageAction } from "../../../../state/message/messageActions";
import utils from "../../../../utils/Utils";

let _dispatch;
let _navigate;
let _ls;
let _unitId;
let _lsUser;
let _entity = new Entity();

export const init = (dispatch, navigate) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _lsUser = utils.getLSUser();
    _ls = useSelector((state) => state.layoutReducer);
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setUnitId(params?.unitId);
    _dispatch(
        setPagePropsAction({
            unitId: null,
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
    }
};

export const onAdd = () => {
    _dispatch(setPagePropsAction({ action: "ADD" }));
};

const setUnitId = (unitId) => {
    _unitId =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? !isNaN(unitId) && unitId > 0
                ? unitId
                : 0
            : _lsUser?.unitId;
};

const addAction = () => {
    let path =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? `${basePath}/tickets/add/${_unitId}`
            : `${basePath}/tickets/add`;

    _navigate(path);
};

const fillForm = async (data = null) => {
    _dispatch(setLoadingAction(true));

    await fetchUnit();
    await fetchTickets(data);

    _dispatch(setLoadingAction(false));
};

const fetchUnit = async () => {
    if (_unitId <= 0) {
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

    const unit = new Unit();
    let result = await unit.get(_unitId);

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

    _dispatch(setPagePropsAction({ unit: result?.item }));
    _dispatch(setTitleAction(`${strings._title} [ ${result?.item?.title} ]`));
};

const fetchTickets = async (data = null) => {
    let result =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? await _entity.paginateAdmin(_unitId)
            : await _entity.paginateUser();

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
