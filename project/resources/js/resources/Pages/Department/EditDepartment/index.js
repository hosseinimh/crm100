import React from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { InputTextColumn, SubmitCancelForm } from "../../../components";
import * as funcs from "./funcs";
import { editDepartmentPage as strings } from "../../../../constants/strings";
import { editDepartmentSchema as schema } from "../../../validations";

const EditDepartment = () => {
    const _ls = useSelector((state) => state.layoutReducer);
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    return (
        <SubmitCancelForm
            page={"Organizations"}
            funcs={funcs}
            setValue={setValue}
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

export default EditDepartment;
