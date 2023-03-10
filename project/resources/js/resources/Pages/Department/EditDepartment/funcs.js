import { Department as Entity } from "../../../../http/entities";
import {
    general,
    editDepartmentPage as strings,
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
let _departmentId;
let _callbackUrl;
let _entity = new Entity();

export const init = (dispatch, navigate, setValue) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _setValue = setValue;
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setDepartmentId(params?.departmentId);

    _callbackUrl = `${basePath}/organizations`;

    if (_departmentId > 0) {
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

    let result = await _entity.update(_departmentId, data.title);

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

const setDepartmentId = (departmentId) => {
    _departmentId = !isNaN(departmentId) && departmentId > 0 ? departmentId : 0;
};

const fillForm = async () => {
    let result = await _entity.get(_departmentId);

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

    _callbackUrl = `${basePath}/departments/${result?.item?.organizationId}`;

    _setValue("title", result.item.title);

    _dispatch(setTitleAction(`${strings._title} [ ${result.item.title} ]`));
};
