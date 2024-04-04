import { z } from "zod";

export const formSchema = z.object({
    theme: z.enum(["light", "dark"], {
        required_error: "Please select a theme.",
    }),
    font: z.enum(["inter", "manrope", "system"], {
        invalid_type_error: "Select a font",
        required_error: "Please select a font.",
    }),
});

export type FormSchema = typeof formSchema;