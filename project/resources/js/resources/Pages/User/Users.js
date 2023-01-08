import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Page } from "../_layout";
import { Unit, User as Entity } from "../../../http/entities";
import { usersPage as strings, general } from "../../../constants/strings";
import { Table } from "../../components";
import { MESSAGE_TYPES, imgPath, basePath } from "../../../constants";
import { userSearchSchema as schema } from "../../validations";
import {
    setLoadingAction,
    setTitleAction,
} from "../../../state/layout/layoutActions";
import { setMessageAction } from "../../../state/message/messageActions";

const Users = () => {
    const dispatch = useDispatch();
    const layoutState = useSelector((state) => state.layoutReducer);
    const messageState = useSelector((state) => state.messageReducer);
    const navigate = useNavigate();
    let entity = new Entity();
    const columnsCount = 4;
    let { unitId } = useParams();
    unitId = parseInt(unitId);
    const [items, setItems] = useState(null);
    const [item, setItem] = useState(null);
    const [unit, setUnit] = useState({});
    const [action, setAction] = useState(null);
    const [isCurrent, setIsCurrent] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data = null) => {
        fillForm(data);
    };

    const fillForm = async (data = null) => {
        dispatch(setLoadingAction(true));

        let result = await entity.getPagination(
            data?.username ?? "",
            data?.nameFamily ?? "",
            data?.nameFamily ?? "",
            unit?.id ?? null
        );

        dispatch(setLoadingAction(false));

        if (result === null) {
            setItems(null);
            dispatch(
                setMessageAction(
                    entity.errorMessage,
                    MESSAGE_TYPES.ERROR,
                    entity.errorCode
                )
            );

            return;
        }

        setItems(result.items);
        dispatch(setLoadingAction(false));
    };

    const onView = (id) => {
        setItem(id);
        setAction("View");
    };

    const onAdd = () => {
        setAction("Add");
    };

    const onEdit = (id) => {
        setItem(id);
        setAction("Edit");
    };

    const onChangePassword = (id) => {
        setItem(id);
        setAction("ChangePassword");
    };

    const fetchUnit = async () => {
        if (isNaN(unitId)) {
            setUnit(null);

            return;
        }

        const unitEntity = new Unit();
        let result = await unitEntity.get(unitId);

        if (result === null) {
            setUnit(null);
        } else {
            setUnit(result.item);
        }
    };

    useEffect(() => {
        if (unit?.id) {
            dispatch(setTitleAction(`${strings._title} [ ${unit?.title}]`));

            fillForm();
        } else if (unit === null) {
            dispatch(setTitleAction(strings._title));

            fillForm();
        }
    }, [unit]);

    useEffect(() => {
        dispatch(setTitleAction(strings._title));

        fetchUnit();

        return () => {
            setIsCurrent(false);
        };
    }, []);

    const renderFilterSection = () => (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-6">
                        <input
                            {...register("username")}
                            className={
                                messageState?.messageField === "username"
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            placeholder={strings.username}
                            disabled={layoutState?.loading}
                        />
                        {messageState?.messageField === "username" && (
                            <div className="invalid-feedback">
                                {messageState?.message}
                            </div>
                        )}
                    </div>
                    <div className="col-sm-6">
                        <input
                            {...register("nameFamily")}
                            className={
                                messageState?.messageField === "nameFamily"
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            maxLength="50"
                            placeholder={strings.nameFamily}
                            disabled={layoutState?.loading}
                        />
                        {messageState?.messageField === "nameFamily" && (
                            <div className="invalid-feedback">
                                {messageState?.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <div className="row">
                    <div className="col-sm-12">
                        <button
                            className="btn btn-dark px-4"
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={layoutState?.loading}
                            title={strings.searchSubmit}
                        >
                            {strings.searchSubmit}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col" style={{ width: "150px" }}>
                {strings.username}
            </th>
            <th scope="col" style={{ width: "150px" }}>
                {strings.nameFamily}
            </th>
            <th scope="col">{strings.unitFull}</th>
        </tr>
    );

    const renderItems = () => {
        if (items && items.length > 0) {
            return items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <tr>
                        <td scope="row">{index + 1}</td>
                        <td>{item.username}</td>
                        <td>{`${item.name} ${item.family}`}</td>
                        <td>
                            {item.unitId > 0 &&
                                `${item.organizationTitle} / ${item.departmentTitle} / ${item.unitTitle}`}
                            {item.unitId === 0 && "------"}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={columnsCount}>
                            <button
                                type="button"
                                className="btn btn-info mb-2 px-4 ml-2"
                                onClick={() => onView(item.id)}
                                title={general.view}
                                disabled={layoutState?.loading}
                            >
                                {general.view}
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning mb-2 px-4 ml-2"
                                onClick={() => onEdit(item.id)}
                                title={general.edit}
                                disabled={layoutState?.loading}
                            >
                                {general.edit}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary mb-2 px-4 ml-2"
                                onClick={() => onChangePassword(item.id)}
                                title={strings.changePassword}
                                disabled={layoutState?.loading}
                            >
                                {strings.changePassword}
                            </button>
                        </td>
                    </tr>
                </React.Fragment>
            ));
        }

        if (layoutState?.loading) {
            return (
                <tr>
                    <td colSpan={columnsCount} className="img-loading-wrapper">
                        <img
                            src={`${imgPath}/loading-form.gif`}
                            className="img-loading"
                        />
                    </td>
                </tr>
            );
        }

        return (
            <tr>
                <td colSpan={columnsCount}>{general.noDataFound}</td>
            </tr>
        );
    };

    if (!isCurrent) <></>;

    if (action === "Add") {
        let path = unit?.id
            ? `${basePath}/users/add/${unit.id}`
            : `${basePath}/users/add`;

        return <Navigate to={path} replace={true} />;
    } else if (item) {
        if (action === "Edit") {
            return (
                <Navigate
                    to={`${basePath}/users/edit/${item}`}
                    replace={true}
                />
            );
        } else if (action === "ChangePassword") {
            return (
                <Navigate
                    to={`${basePath}/users/change_password/${item}`}
                    replace={true}
                />
            );
        } else {
            return (
                <Navigate
                    to={`${basePath}/users/view/${item}`}
                    replace={true}
                />
            );
        }
    }

    return (
        <Page page={"Users"} errors={errors}>
            {renderFilterSection()}
            <div className="row">
                <div className="col-sm-12 my-4">
                    <button
                        className="btn btn-dark px-4"
                        type="button"
                        disabled={layoutState?.loading}
                        title={strings.addUser}
                        onClick={() => onAdd()}
                    >
                        {strings.addUser}
                    </button>
                </div>
            </div>
            <div className="row mb-4">
                <Table
                    items={items}
                    renderHeader={renderHeader}
                    renderItems={renderItems}
                />
            </div>
        </Page>
    );
};

export default Users;
