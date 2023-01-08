import React from "react";
import { useSelector } from "react-redux";

import { ticketsPage as strings } from "../../../../constants/strings";
import * as funcs from "./funcs";
import { AddList, TableItems } from "../../../components";
import { Link } from "react-router-dom";
import { basePath, USER_ROLES } from "../../../../constants";
import utils from "../../../../utils/Utils";

const Tickets = () => {
    const _ls = useSelector((state) => state.layoutReducer);
    const _lsUser = utils.getLSUser();
    const _columnsCount = 4;

    const renderHeader = () => (
        <tr>
            <th scope="col" style={{ width: "50px" }}>
                #
            </th>
            <th scope="col" style={{ width: "200px" }}>
                {strings.type}
            </th>
            <th scope="col">{strings.subject}</th>
            <th scope="col" style={{ width: "250px" }}>
                {strings.lastUpdate}
            </th>
        </tr>
    );

    const renderItems = () => {
        const children = _ls?.pageProps?.items?.map((item, index) => (
            <tr key={item.id}>
                <td scope="row">{index + 1}</td>
                <td>
                    <Link
                        to={`${basePath}/tickets/threads/${item.id}`}
                        className="link"
                    >
                        {item.typeText}
                    </Link>
                </td>
                <td>
                    <p
                        style={{
                            maxHeight: "3rem",
                            whiteSpace: "pre-wrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight:
                                (_lsUser?.role === USER_ROLES.ADMINISTRATOR &&
                                    !item.adminSeenTime) ||
                                (_lsUser?.role === USER_ROLES.USER &&
                                    !item.userSeenTime)
                                    ? "bold"
                                    : "",
                        }}
                    >
                        {`${utils.en2faDigits(item.id)}# - ${item.subject}`}
                    </p>
                </td>
                <td>
                    {item.faUpdatedAt || item.faCreatedAt}
                    <p>
                        <span className="badge bg-primary ms-auto">
                            {item.statusText}
                        </span>
                    </p>
                </td>
            </tr>
        ));

        return <TableItems columnsCount={_columnsCount} children={children} />;
    };

    return (
        <AddList
            page={
                _lsUser?.role === USER_ROLES.ADMINISTRATOR
                    ? "Organizations"
                    : "Tickets"
            }
            renderHeader={renderHeader}
            renderItems={renderItems}
            strings={strings}
            funcs={funcs}
            backUrl={
                _lsUser?.role === USER_ROLES.ADMINISTRATOR
                    ? `${basePath}/units/${_ls?.pageProps?.unit?.departmentId}`
                    : null
            }
        />
    );
};

export default Tickets;
