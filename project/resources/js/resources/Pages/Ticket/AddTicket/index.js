import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    InputFileColumn,
    InputSelectColumn,
    InputTextAreaColumn,
    InputTextColumn,
    SubmitCancelForm,
} from "../../../components";
import * as funcs from "./funcs";
import {
    ticketTypes,
    addTicketPage as strings,
} from "../../../../constants/strings";
import { addTicketSchema as schema } from "../../../validations";
import utils from "../../../../utils/Utils";
import { TICKET_TYPES, USER_ROLES } from "../../../../constants";

const AddTicket = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const lsUser = utils.getLSUser();
    const types = [
        { id: TICKET_TYPES.TYPE1, value: ticketTypes.type1 },
        { id: TICKET_TYPES.TYPE2, value: ticketTypes.type2 },
        { id: TICKET_TYPES.TYPE3, value: ticketTypes.type3 },
        { id: TICKET_TYPES.TYPE4, value: ticketTypes.type4 },
        { id: TICKET_TYPES.TYPE5, value: ticketTypes.type5 },
    ];

    const onChangeFile = (e) => {
        const f = e?.target?.files[0];

        if (f) {
            funcs.setFile(f);
        }
    };

    return (
        <SubmitCancelForm
            page={
                lsUser?.role === USER_ROLES.ADMINISTRATOR
                    ? "Organizations"
                    : "Tickets"
            }
            funcs={funcs}
            handleSubmit={handleSubmit}
            errors={errors}
        >
            <InputSelectColumn
                field="type"
                register={register}
                strings={strings}
                items={types}
                keyItem={"id"}
                valueItem={"value"}
            />
            <InputTextColumn
                field="subject"
                register={register}
                strings={strings}
            />
            <InputTextAreaColumn
                field="content"
                register={register}
                strings={strings}
                msgErrors={errors}
            />
            {lsUser?.role === USER_ROLES.USER && (
                <InputFileColumn
                    field="file"
                    register={register}
                    accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                    onChangeFile={(e) => onChangeFile(e)}
                    strings={strings}
                    msgErrors={errors}
                />
            )}
        </SubmitCancelForm>
    );
};

export default AddTicket;
