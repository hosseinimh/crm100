import * as yup from "yup";
import {
    validation,
    ticketThreadsPage as strings,
} from "../../../constants/strings";

const addTicketThreadSchema = yup.object().shape({
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

export default addTicketThreadSchema;
