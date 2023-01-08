import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Navigate, Route } from "react-router";

import * as Pages from "../Pages";
import { Header, Sidebar } from "../components";
import { footer as strings } from "../../constants/strings";
import utils from "../../utils/Utils";
import { basePath, USER_ROLES } from "../../constants";

function AuthRoute() {
    const state = useSelector((state) => state.userReducer);
    const layoutState = useSelector((state) => state.layoutReducer);
    const [auth, setAuth] = useState(state.isAuthenticated);
    const lsUser = utils.getLSUser();

    useEffect(() => {
        validateAuth();
    }, [state]);

    const validateAuth = () => {
        try {
            if (!state.isAuthenticated || !lsUser || !lsUser?.id) {
                utils.clearLS();
                setAuth(false);
            } else {
                setAuth(true);
            }
        } catch (error) {
            utils.clearLS();
            setAuth(false);
        }
    };

    return (
        <Router>
            {auth && <Sidebar />}
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                {auth && (
                    <>
                        <Header />
                        <Routes>
                            {lsUser?.role === USER_ROLES.ADMINISTRATOR && (
                                <>
                                    <Route
                                        path={`${basePath}/users/view/:userId`}
                                        element={<Pages.ViewUser />}
                                    />
                                    <Route
                                        path={`${basePath}/users/add/:unitId`}
                                        element={<Pages.AddUser />}
                                    />
                                    <Route
                                        path={`${basePath}/users/add`}
                                        element={<Pages.AddUser />}
                                    />
                                    <Route
                                        path={`${basePath}/users/edit/:userId`}
                                        element={<Pages.EditUser />}
                                    />
                                    <Route
                                        path={`${basePath}/users/change_password/:userId`}
                                        element={<Pages.ChangePasswordUser />}
                                    />
                                    <Route
                                        path={`${basePath}/users/login`}
                                        element={<Navigate to={basePath} />}
                                    />
                                    <Route
                                        path={`${basePath}/users/:unitId`}
                                        element={<Pages.Users />}
                                    />
                                    <Route
                                        path={`${basePath}/users`}
                                        element={<Pages.Users />}
                                    />
                                    <Route
                                        path={`${basePath}/organizations/add/`}
                                        element={<Pages.AddOrganization />}
                                    />
                                    <Route
                                        path={`${basePath}/organizations/edit/:organizationId`}
                                        element={<Pages.EditOrganization />}
                                    />
                                    <Route
                                        path={`${basePath}/organizations`}
                                        element={<Pages.Organizations />}
                                    />
                                    <Route
                                        path={`${basePath}/departments/add/:organizationId`}
                                        element={<Pages.AddDepartment />}
                                    />
                                    <Route
                                        path={`${basePath}/departments/edit/:departmentId`}
                                        element={<Pages.EditDepartment />}
                                    />
                                    <Route
                                        path={`${basePath}/departments/:organizationId`}
                                        element={<Pages.Departments />}
                                    />
                                    <Route
                                        path={`${basePath}/units/add/:departmentId`}
                                        element={<Pages.AddUnit />}
                                    />
                                    <Route
                                        path={`${basePath}/units/edit/:unitId`}
                                        element={<Pages.EditUnit />}
                                    />
                                    <Route
                                        path={`${basePath}/units/:departmentId`}
                                        element={<Pages.Units />}
                                    />
                                    <Route
                                        path={`${basePath}/documents/add/:unitId`}
                                        element={<Pages.AddDocument />}
                                    />
                                    <Route
                                        path={`${basePath}/documents/edit/:documentId`}
                                        element={<Pages.EditDocument />}
                                    />
                                    <Route
                                        path={`${basePath}/documents/:unitId`}
                                        element={<Pages.Documents />}
                                    />
                                    <Route
                                        path={`${basePath}/tickets/add/:unitId`}
                                        element={<Pages.AddTicket />}
                                    />
                                    <Route
                                        path={`${basePath}/tickets/:unitId`}
                                        element={<Pages.Tickets />}
                                    />
                                </>
                            )}

                            {lsUser?.role === USER_ROLES.USER && (
                                <>
                                    <Route
                                        path={`${basePath}/documents`}
                                        element={<Pages.Documents />}
                                    />
                                    <Route
                                        path={`${basePath}/tickets/add`}
                                        element={<Pages.AddTicket />}
                                    />
                                    <Route
                                        path={`${basePath}/tickets`}
                                        element={<Pages.Tickets />}
                                    />
                                </>
                            )}

                            <Route
                                path={basePath}
                                element={<Pages.Dashboard />}
                            />
                            <Route
                                path={`${basePath}/users/view`}
                                element={<Pages.ViewUser />}
                            />
                            <Route
                                path={`${basePath}/users/change_password`}
                                element={<Pages.ChangePasswordUser />}
                            />
                            <Route
                                path={`${basePath}/tickets/threads/:ticketId`}
                                element={<Pages.TicketThreads />}
                            />
                            <Route
                                path="*"
                                element={<Navigate to={basePath} />}
                            />
                        </Routes>
                    </>
                )}
                {!auth && (
                    <Routes>
                        <Route
                            path={`${basePath}/users/login`}
                            exact={true}
                            element={<Pages.LoginUser />}
                        />
                        <Route
                            path="*"
                            element={
                                <Navigate to={`${basePath}/users/login`} />
                            }
                        />
                    </Routes>
                )}
                <footer className="footer d-print-none">
                    <div className="container-fluid sub-footer">
                        <p>{strings.text14}</p>
                        <p className="developer">
                            <a
                                href="http://www.hosseinimh.com"
                                target={"_blank"}
                                className="link"
                            >
                                {strings.text15}
                            </a>
                        </p>
                    </div>
                </footer>
                <div
                    className="loading-wrapper"
                    style={{
                        display: layoutState?.loading ? "flex" : "none",
                    }}
                >
                    <div className="loading"></div>
                    <p>{strings.loading}</p>
                </div>
            </div>
        </Router>
    );
}

export default AuthRoute;
