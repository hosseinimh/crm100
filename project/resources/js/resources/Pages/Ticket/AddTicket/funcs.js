import { Ticket as Entity, Unit } from "../../../../http/entities";
import { addTicketPage as strings } from "../../../../constants/strings";
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
let _callbackUrl;
let _lsUser;
let _unitId;
let _file;
let _entity = new Entity();

export const init = (dispatch, navigate) => {
    _dispatch = dispatch;
    _navigate = navigate;
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));

    _lsUser = utils.getLSUser();

    setUnitId(params?.unitId);

    _callbackUrl =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? `${basePath}/tickets/${_unitId}`
            : `${basePath}/tickets`;

    fetchUnit();
};

export const onLayoutState = () => {};

export const onSubmit = async (data) => {
    _dispatch(setLoadingAction(true));
    _dispatch(clearMessageAction());

    let result =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? await _entity.storeAdmin(
                  _unitId,
                  data.type,
                  data.subject,
                  data.content
              )
            : await _entity.storeUser(
                  data.type,
                  data.subject,
                  data.content,
                  _file
              );

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

const setUnitId = (unitId) => {
    _unitId =
        _lsUser?.role === USER_ROLES.ADMINISTRATOR
            ? !isNaN(unitId) && unitId > 0
                ? unitId
                : 0
            : _lsUser?.unitId;
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
        _navigate(_callbackUrl);

        return null;
    }

    _dispatch(setPagePropsAction({ unit: result?.item }));
    _dispatch(setTitleAction(`${strings._title} [ ${result?.item?.title} ]`));
};
