import { Unit as Entity } from "../../../../http/entities";
import {
    general,
    editUnitPage as strings,
} from "../../../../constants/strings";
import {
    setLoadingAction,
    setTitleAction,
} from "../../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../../state/message/messageActions";
import { basePath, MESSAGE_CODES, MESSAGE_TYPES } from "../../../../constants";

let _dispatch;
let _navigate;
let _setValue;
let _unitId;
let _callbackUrl;
let _entity = new Entity();

export const init = (dispatch, navigate, setValue) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _setValue = setValue;
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setUnitId(params?.unitId);

    _callbackUrl = `${basePath}/organizations`;

    if (_unitId > 0) {
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

export const onLayoutState = () => {};

export const onSubmit = async (data) => {
    _dispatch(setLoadingAction(true));
    _dispatch(clearMessageAction());

    let result = await _entity.update(_unitId, data.title);

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

const setUnitId = (unitId) => {
    _unitId = !isNaN(unitId) && unitId > 0 ? unitId : 0;
};

const fillForm = async () => {
    let result = await _entity.get(_unitId);

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

    _callbackUrl = `${basePath}/units/${result?.item?.departmentId}`;

    _setValue("title", result.item.title);

    _dispatch(setTitleAction(`${strings._title} [ ${result.item.title} ]`));
};
