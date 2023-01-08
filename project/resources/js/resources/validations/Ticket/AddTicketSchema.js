import * as yup from "yup";
import {
    validation,
    addTicketPage as strings,
} from "../../../constants/strings";

const addTicketSchema = yup.object().shape({
    type: yup
        .number()
        .typeError(validation.numberMessage.replace(":field", strings.type))
        .required(validation.requiredMessage.replace(":field", strings.type)),
    subject: yup
        .string(validation.stringMessage.replace(":field", strings.subject))
        .min(
            10,
            validation.minMessage
                .replace(":field", strings.subject)
                .replace(":min", "10")
        )
        .max(
            200,
            validation.maxMessage
                .replace(":field", strings.subject)
                .replace(":max", "200")
        )
        .required(
            validation.requiredMessage.replace(":field", strings.subject)
        ),
    content: yup
        .string(validation.stringMessage.replace(":field", strings.content))
        .min(
            10,
            validation.minMessage
                .replace(":field", strings.content)
                .replace(":min", "10")
        )
        .max(
            1000,
            validation.maxMessage
                .replace(":field", strings.content)
                .replace(":max", "1000")
        )
        .required(
            validation.requiredMessage.replace(":field", strings.content)
        ),
});

export default addTicketSchema;
