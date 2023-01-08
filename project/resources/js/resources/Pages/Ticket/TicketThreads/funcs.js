import { useSelector } from "react-redux";

import { Ticket as Entity } from "../../../../http/entities";
import {
    general,
    ticketThreadsPage as strings,
} from "../../../../constants/strings";
import {
    setLoadingAction,
    setPagePropsAction,
    setTitleAction,
} from "../../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../../state/message/messageActions";
import {
    basePath,
    MESSAGE_CODES,
    MESSAGE_TYPES,
    USER_ROLES,
} from "../../../../constants";
import utils from "../../../../utils/Utils";

let _dispatch;
let _navigate;
let _ls;
let _ticketId;
let _lsUser;
let _callbackUrl;
let _file;
let _entity = new Entity();

export const init = (dispatch, navigate, setValue) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _ls = useSelector((state) => state.layoutReducer);
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));

    setTicketId(params?.ticketId);

    _lsUser = utils.getLSUser();
    _callbackUrl =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? `${basePath}/organizations`
            : `${basePath}/tickets`;

    if (_ticketId > 0) {
        fillForm();
    } else {
        _dispatch(
            setMessageAction(
                general.itemNotFound,
                MESSAGE_TYPES.ERROR,
                MESSAGE_CODES.ITEM_NOT_FOUND,
                false
            )
        );
        _navigate(_callbackUrl);
    }
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
        case "CHANGE_STATUS":
            changeStatusAction();

            return;
    }
};

export const onSeen = async () => {
    await _entity.seen(_ticketId);
};

export const onChangeStatus = () => {
    _dispatch(setPagePropsAction({ action: "CHANGE_STATUS" }));
};

export const onSubmit = async (data) => {
    _dispatch(setLoadingAction(true));
    _dispatch(clearMessageAction());

    let result =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? await _entity.storeThreadAdmin(_ticketId, data.content)
            : await _entity.storeThreadUser(_ticketId, data.content, _file);

    if (result === null) {
        _dispatch(setLoadingAction(false));
        _dispatch(
            setMessageAction(
                _entity.errorMessage,
                MESSAGE_TYPES.ERROR,
                _entity.errorCode
            )
        );

        return;
    }

    _dispatch(
        setMessageAction(
            strings.submitted,
            MESSAGE_TYPES.SUCCESS,
            MESSAGE_CODES.OK,
            false
        )
    );

    _navigate(_callbackUrl);
};

export const onCancel = () => {
    _navigate(_callbackUrl);
};

export const setFile = (file) => {
    _file = file;
};

const setTicketId = (ticketId) => {
    _ticketId = !isNaN(ticketId) && ticketId > 0 ? ticketId : 0;
};

const fillForm = async (data = null) => {
    _dispatch(setLoadingAction(true));

    await fetchTicketThreads(data);

    _dispatch(setLoadingAction(false));
};

const fetchTicketThreads = async (data = null) => {
    let result =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? await _entity.getAdmin(_ticketId)
            : await _entity.getUser(_ticketId);

    if (result === null) {
        _dispatch(setPagePropsAction({ item: null, threads: null }));
        _dispatch(
            setMessageAction(
                _entity.errorMessage,
                MESSAGE_TYPES.ERROR,
                _entity.errorCode
            )
        );

        return;
    }

    if (_lsUser?.role === USER_ROLES.ADMINISTRATOR) {
        _callbackUrl = `${basePath}/tickets/${result?.item?.unitId}`;
    }

    _dispatch(
        setTitleAction(
            `${strings._title} [ #${utils.en2faDigits(result?.item?.id)} - ${
                result?.item?.subject
            } ]`
        )
    );
    _dispatch(
        setPagePropsAction({ item: result.item, threads: result.threads })
    );
};

const changeStatusAction = async () => {
    if (_lsUser?.role === USER_ROLES.ADMINISTRATOR) {
        return;
    }

    _dispatch(setLoadingAction(true));

    await _entity.changeStatus(_ticketId);
    await fetchTicketThreads();

    _dispatch(setLoadingAction(false));
};
