import { useSelector } from "react-redux";

import { Department, Unit as Entity } from "../../../../http/entities";
import { general, addUnitPage as strings } from "../../../../constants/strings";
import {
    setLoadingAction,
    setPagePropsAction,
    setTitleAction,
} from "../../../../state/layout/layoutActions";
import {
    clearMessageAction,
    setMessageAction,
} from "../../../../state/message/messageActions";
import { basePath, MESSAGE_CODES, MESSAGE_TYPES } from "../../../../constants";

let _dispatch;
let _navigate;
let _departmentId;
let _callbackUrl;
let _ls;
let _entity = new Entity();

export const init = (dispatch, navigate) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _ls = useSelector((state) => state.layoutReducer);
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setDepartmentId(params?.departmentId);

    _callbackUrl = params?.departmentId
        ? `${basePath}/units/${params.departmentId}`
        : `${basePath}/organizations`;

    fetchDepartment();
};

export const onLayoutState = () => {};

export const onSubmit = async (data) => {
    _dispatch(setLoadingAction(true));
    _dispatch(clearMessageAction());

    let result = await _entity.store(_departmentId, data.title);

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
