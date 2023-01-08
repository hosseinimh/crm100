import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InputTextColumn, SubmitCancelForm } from "../../../components";
import * as funcs from "./funcs";
import { addUnitPage as strings } from "../../../../constants/strings";
import { addUnitSchema as schema } from "../../../validations";

const AddUnit = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    return (
        <SubmitCancelForm
            page={"Organizations"}
            funcs={funcs}
            handleSubmit={handleSubmit}
            errors={errors}
        >
            <InputTextColumn
                field="title"
                register={register}
                strings={strings}
            />
        </SubmitCancelForm>
    );
};

export default AddUnit;
