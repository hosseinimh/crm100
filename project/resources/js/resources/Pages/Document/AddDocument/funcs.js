import { useSelector } from "react-redux";

import { Unit, Document as Entity } from "../../../../http/entities";
import {
    general,
    addDocumentPage as strings,
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
import { basePath, MESSAGE_CODES, MESSAGE_TYPES } from "../../../../constants";

let _dispatch;
let _navigate;
let _unitId;
let _callbackUrl;
let _ls;
let _file;
let _entity = new Entity();

export const init = (dispatch, navigate) => {
    _dispatch = dispatch;
    _navigate = navigate;
    _ls = useSelector((state) => state.layoutReducer);
};

export const onLoad = (params) => {
    _dispatch(setTitleAction(strings._title));
    setUnitId(params?.unitId);

    _callbackUrl = params?.unitId
        ? `${basePath}/documents/${params.unitId}`
        : `${basePath}/organizations`;

    fetchUnit();
};

export const onLayoutState = () => {};

export const onSubmit = async (data) => {
    _dispatch(setLoadingAction(true));
    _dispatch(clearMessageAction());

    let result = await _entity.store(
        _unitId,
        data.title,
        data.description,
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
    _unitId = !isNaN(unitId) && unitId > 0 ? unitId : 0;
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
