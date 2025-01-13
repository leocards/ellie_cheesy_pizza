import { User } from "@/types";
import { z } from "zod";

export const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

const USERSCHEMA = z.object({
    first_name: z.string().min(1, "The firt name field is required."),
    last_name: z.string().min(1, "The last name field is required."),
    middle_name: z.string().optional().default(""),
    birthdate: z.date().nullable().refine((birthdate) => {
        if (!birthdate) {
            return false
        }
        return true
    }, "The birthdate field is required."),
    sex: z.enum(['male', 'female'], {
        required_error: "The sex field is required.",
        invalid_type_error: "The sex field must be male or female",
    })
        .optional()
        .refine((val) => val !== null, {
            message: "The sex field is required.",
        }),
    address: z.string().min(1, "The address field is required."),
    mobile: z.string().optional().default("").refine((mobile) => {
        if(mobile)
            if(mobile.length < 11) return false;

        return true;
    }, "The mobile no. must be 11 characters long."),
    email: z.string().email("Must be an email.").min(1, "The email field is required."),
    role: z
        .enum(['admin', 'staff'], {
            required_error: "The role field is required.",
            invalid_type_error: "The role field must be admin or staff",
        })
        .optional()
        .refine((val) => val !== null, {
            message: "The role field is required.",
        }),
    username: z.string().min(8, "The username must have atleast 8 characters."),
    password: z.string().min(8, "The password must have atleast 8 characters."),
    avatar: z.instanceof(File, { message: "Please choose a file." })
        .optional()
        .nullable()
        .refine((file) => {
            if (file) {
                if (!allowedMimeTypes.includes(file.type))
                    return false
            }
            return true
        }, {
            message: "Only JPEG, JPG, and PNG files are allowed.",
        })
        .refine((file) => {
            if (file) {
                if (parseFloat((file.size / (1024*1024)).toFixed(2)) > 10)
                    return false
            }

            return true
        }, {
            message: "File size should not exceed 10MB",
        })
})

type IFormUser = z.infer<typeof USERSCHEMA>

const InitialValues = (userEdit: User) => {
    let user: IFormUser = {
        first_name: userEdit?.first_name || "",
        last_name: userEdit?.last_name || "",
        middle_name: userEdit?.middle_name || "",
        birthdate: userEdit ? new Date(userEdit.birthdate) : null,
        sex: userEdit?.sex || undefined,
        address: userEdit?.address || "",
        mobile: userEdit?.mobile || "",
        email: userEdit?.email || "",
        role: userEdit?.role || undefined,
        username: userEdit?.username || "",
        password: userEdit ? "************************" : "",
        avatar: null,
    }

    return user;
}

function calculateAge(birthdate: Date): number {
    const today = new Date();
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    let age = today.getFullYear() - birthYear;

    // Adjust if the birthday hasn't happened yet this year
    if (
        today.getMonth() < birthMonth ||
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age > 0 ? age : 0;
}

export {
    USERSCHEMA,

    type IFormUser,

    InitialValues,
    calculateAge
}
