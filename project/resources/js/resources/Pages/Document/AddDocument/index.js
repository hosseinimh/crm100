import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
    InputFileColumn,
    InputTextAreaColumn,
    InputTextColumn,
    SubmitCancelForm,
} from "../../../components";
import * as funcs from "./funcs";
import { addDocumentPage as strings } from "../../../../constants/strings";
import { addDocumentSchema as schema } from "../../../validations";

const AddDocument = () => {
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
            <InputTextAreaColumn
                field="description"
                register={register}
                strings={strings}
                msgErrors={errors}
            />
            <InputFileColumn
                field="file"
                register={register}
                accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                onChangeFile={(e) => onChangeFile(e)}
                strings={strings}
                msgErrors={errors}
            />
        </SubmitCancelForm>
    );
};

export default AddDocument;
