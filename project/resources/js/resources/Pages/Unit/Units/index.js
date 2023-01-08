import React from "react";
import { useSelector } from "react-redux";

import { unitsPage as strings, general } from "../../../../constants/strings";
import * as funcs from "./funcs";
import { AddList, TableItems } from "../../../components";
import { basePath } from "../../../../constants";

const Units = () => {
    const _columnsCount = 2;
    const _ls = useSelector((state) => state.layoutReducer);

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col">{strings.title}</th>
        </tr>
    );

    const renderItems = () => {
        const children = _ls?.pageProps?.items?.map((item, index) => (
            <React.Fragment key={item.id}>
                <tr key={item.id}>
                    <td scope="row">{index + 1}</td>
                    <td>{item.title}</td>
                </tr>
                <tr>
                    <td colSpan={_columnsCount}>
                        <button
                            type="button"
                            className="btn btn-warning mb-2 px-4 ml-2"
                            onClick={() => funcs.onEdit(item)}
                            title={general.edit}
                            disabled={_ls?.loading}
                        >
                            {general.edit}
                        </button>
                        <button
                            type="button"
                            className="btn btn-success mb-2 px-4 ml-2"
                            onClick={() => funcs.onDocuments(item)}
                            title={strings.documents}
                            disabled={_ls?.loading}
                        >
                            {strings.documents}
                        </button>
                        <button
                            type="button"
                            className="btn btn-info mb-2 px-4 ml-2"
                            onClick={() => funcs.onUsers(item)}
                            title={strings.users}
                            disabled={_ls?.loading}
                        >
                            {strings.users}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary mb-2 px-4 ml-2"
                            onClick={() => funcs.onTickets(item)}
                            title={strings.tickets}
                            disabled={_ls?.loading}
                        >
                            {strings.tickets}
                        </button>
                    </td>
                </tr>
            </React.Fragment>
        ));

        return <TableItems columnsCount={_columnsCount} children={children} />;
    };

    return (
        <AddList
            page={"Organizations"}
            renderHeader={renderHeader}
            renderItems={renderItems}
            strings={strings}
            funcs={funcs}
            backUrl={`${basePath}/departments/${_ls?.pageProps?.department?.organizationId}`}
        />
    );
};

export default Units;
