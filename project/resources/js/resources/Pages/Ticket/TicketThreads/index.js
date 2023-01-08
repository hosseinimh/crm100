import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    InputFileColumn,
    InputTextAreaColumn,
    PageList,
} from "../../../components";
import * as funcs from "./funcs";
import {
    general,
    ticketThreadsPage as strings,
} from "../../../../constants/strings";
import { addTicketThreadSchema as schema } from "../../../validations";
import {
    basePath,
    storagePath,
    TICKET_STATUSES,
    USER_ROLES,
} from "../../../../constants";
import utils from "../../../../utils/Utils";
import { BsPaperclip } from "react-icons/bs";

const TicketThreads = () => {
    const _ls = useSelector((state) => state.layoutReducer);
    const _navigate = useNavigate();
    const _lsUser = utils.getLSUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onChangeFile = (e) => {
        const f = e?.target?.files[0];

        if (f) {
            funcs.setFile(f);
        }
    };

    useEffect(() => {
        funcs.onSeen();
    }, []);

    return (
        <PageList
            page={
                _lsUser?.role === USER_ROLES.ADMINISTRATOR
                    ? "Organizations"
                    : "Tickets"
            }
            funcs={funcs}
        >
            <div className="row mb-2">
                <div className="col-sm-12 mb-4">
                    {_ls?.pageProps?.item?.status === TICKET_STATUSES.OPEN && (
                        <button
                            className="btn btn-warning mr-2 px-4"
                            type="button"
                            title={strings.closeTicket}
                            onClick={funcs.onChangeStatus}
                            disabled={_ls?.loading}
                        >
                            {strings.closeTicket}
                        </button>
                    )}
                    <button
                        className="btn btn-secondary mr-2 px-4"
                        type="button"
                        title={general.back}
                        onClick={() =>
                            _navigate(
                                _lsUser?.role === USER_ROLES.ADMINISTRATOR
                                    ? `${basePath}/tickets/${_ls?.pageProps?.item?.unitId}`
                                    : `${basePath}/tickets`
                            )
                        }
                        disabled={_ls?.loading}
                    >
                        {general.back}
                    </button>
                </div>
            </div>
            <p>
                <span className="badge bg-primary ms-auto">
                    {_ls?.pageProps?.item?.statusText}
                </span>
            </p>
            <div className="card mb-4">
                {_ls?.pageProps?.threads?.map((item, index) => (
                    <div
                        key={item.id}
                        className={
                            item?.adminCreated === 0
                                ? "card-body"
                                : "card-footer"
                        }
                        style={{
                            borderTop:
                                index === 0
                                    ? "none"
                                    : "1px solid var(--cui-card-border-color, rgba(0, 0, 21, 0.125))",
                        }}
                    >
                        <div className="row">
                            <div className="col-sm-12">
                                <p
                                    style={{
                                        marginBottom: "0",
                                        fontSize: "0.8rem",
                                        textAlign:
                                            item?.adminCreated === 0
                                                ? "right"
                                                : "left",
                                    }}
                                >
                                    {`${item?.creatorName} ${
                                        item?.creatorFamily
                                    } - ${
                                        item?.adminCreated
                                            ? general.admin
                                            : general.user
                                    }`}
                                </p>
                                <p
                                    className="mb-4"
                                    style={{
                                        fontSize: "0.8rem",
                                        textAlign:
                                            item?.adminCreated === 0
                                                ? "right"
                                                : "left",
                                    }}
                                >
                                    {item?.faCreatedAt}
                                </p>
                                <p
                                    style={{
                                        whiteSpace: "pre-line",
                                        textAlign:
                                            item?.adminCreated === 0
                                                ? "right"
                                                : "left",
                                    }}
                                >
                                    {item?.content}
                                </p>
                            </div>
                            {item?.file && (
                                <div className="col-sm-12 mt-4">
                                    <a
                                        href={`${storagePath}/tickets/threads/files/${item.file}`}
                                        target={"_blank"}
                                    >
                                        <BsPaperclip />
                                        <span>{general.file}</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {_ls?.pageProps?.item?.status === TICKET_STATUSES.OPEN && (
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <InputTextAreaColumn
                                    field="content"
                                    register={register}
                                    strings={strings}
                                    msgErrors={errors}
                                />
                                {_lsUser?.role === USER_ROLES.USER && (
                                    <InputFileColumn
                                        field="file"
                                        register={register}
                                        accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                                        onChangeFile={(e) => onChangeFile(e)}
                                        strings={strings}
                                        msgErrors={errors}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="row">
                            <div className="col-sm-12">
                                <button
                                    className="btn btn-success px-4 ml-2"
                                    type="button"
                                    onClick={handleSubmit(funcs.onSubmit)}
                                    disabled={_ls?.loading}
                                >
                                    {general.submit}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageList>
    );
};

export default TicketThreads;
