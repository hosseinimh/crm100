import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    InputTextCKEditorColumn,
    InputTextColumn,
    SubmitCancelForm,
} from "../../../components";
import * as funcs from "./funcs";
import { editOrganizationPage as strings } from "../../../../constants/strings";
import { editOrganizationSchema as schema } from "../../../validations";
import { setPagePropsAction } from "../../../../state/layout/layoutActions";

const EditOrganization = () => {
    const dispatch = useDispatch();
    const _ls = useSelector((state) => state.layoutReducer);
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        return () => {
            dispatch(setPagePropsAction({ content: null }));
        };
    }, []);

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

export default EditOrganization;
