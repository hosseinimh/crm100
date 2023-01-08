import React from "react";
import { useSelector } from "react-redux";

import {
    departmentsPage as strings,
    general,
} from "../../../../constants/strings";
import * as funcs from "./funcs";
import { AddList, TableItems } from "../../../components";
import { basePath } from "../../../../constants";
import { Link } from "react-router-dom";

const Departments = () => {
    const _columnsCount = 4;
    const _ls = useSelector((state) => state.layoutReducer);

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col">{strings.title}</th>
            <th scope="col" style={{ width: "150px", textAlign: "center" }}>
                {general.actions}
            </th>
        </tr>
    );

    const renderItems = () => {
        const children = _ls?.pageProps?.items?.map((item, index) => (
            <tr key={item.id}>
                <td scope="row">{index + 1}</td>
                <td>
                    <Link to={`${basePath}/units/${item.id}`}>
                        {item.title}
                    </Link>
                </td>
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
            </tr>
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
            backUrl={`${basePath}/organizations`}
        />
    );
};

export default Departments;
