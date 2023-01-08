import React from "react";
import { useSelector } from "react-redux";

import {
    documentsPage as strings,
    general,
} from "../../../../constants/strings";
import * as funcs from "./funcs";
import { AddList, TableItems } from "../../../components";
import { basePath, storagePath, USER_ROLES } from "../../../../constants";
import utils from "../../../../utils/Utils";
import { BsPaperclip } from "react-icons/bs";

const Documents = () => {
    const _columnsCount = _lsUser?.role === USER_ROLES.ADMINISTRATOR ? 3 : 2;
    const _lsUser = utils.getLSUser();
    const _ls = useSelector((state) => state.layoutReducer);

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col">{strings.title}</th>
            {_lsUser?.role === USER_ROLES.ADMINISTRATOR && (
                <th scope="col" style={{ width: "150px", textAlign: "center" }}>
                    {general.actions}
                </th>
            )}
        </tr>
    );

    const renderItems = () => {
        const children = _ls?.pageProps?.items?.map((item, index) => (
            <tr key={item.id}>
                <td scope="row">{index + 1}</td>
                <td>
                    <p>{item.title}</p>
                    {item?.file && (
                        <p className="mt-4">
                            <a
                                href={`${storagePath}/documents/files/${item.file}`}
                                target={"_blank"}
                            >
                                <BsPaperclip />
                                <span>{general.file}</span>
                            </a>
                        </p>
                    )}
                </td>
                {_lsUser?.role === USER_ROLES.ADMINISTRATOR && (
                    <td>
                        <button
                            type="button"
                            className="btn btn-w btn-warning mb-2"
                            onClick={() => funcs.onEdit(item)}
                            title={general.edit}
                            disabled={_ls?.loading}
                        >
                            {general.edit}
                        </button>
                    </td>
                )}
            </tr>
        ));

        return <TableItems columnsCount={_columnsCount} children={children} />;
    };

    return (
        <AddList
            page={
                _lsUser?.role === USER_ROLES.ADMINISTRATOR
                    ? "Organizations"
                    : "Documents"
            }
            renderHeader={renderHeader}
            renderItems={renderItems}
            strings={strings}
            funcs={funcs}
            hasAdd={_lsUser?.role === USER_ROLES.ADMINISTRATOR ? true : false}
            backUrl={
                _lsUser?.role === USER_ROLES.ADMINISTRATOR
                    ? `${basePath}/units/${_ls?.pageProps?.unit?.departmentId}`
                    : null
            }
        />
    );
};

export default Documents;
