import z from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const validatePhone = (value: string): boolean => {
  if (!value || value.trim() === "") {
    return false;
  }

  // Определяем страну на основе номера
  let country: "PL" | "UA" | undefined;
  if (value.startsWith("+380")) {
    country = "UA";
  } else if (value.startsWith("+48")) {
    country = "PL";
  }

  // Если страна не определена, пытаемся определить автоматически
  const phone = parsePhoneNumberFromString(value, country);
  return phone ? phone.isValid() : false;
};

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(validatePhone, {
      message: "Invalid phone number",
    }),
});

export const createProductSchema = z.object({
  namePL: z.string().min(1, 'Назва (PL) обов\'язкова'),
  nameUA: z.string().min(1, 'Назва (UA) обов\'язкова'),
  category: z.enum(['chilled', 'frozen', 'ready', 'marinated', 'snacks', 'other'], {
    message: 'Категорія обов\'язкова',
  }),
  descriptionPL: z.string().min(1, 'Опис (PL) обов\'язковий'),
  descriptionUA: z.string().min(1, 'Опис (UA) обов\'язковий'),
  gramsPerServing: z.coerce.number().min(1, 'Вага повинна бути більше 0'),
  maxGramsPerServing: z.coerce.number().positive('Максимальна вага повинна бути більше 0').optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  price: z.string().transform((val) => {
    const normalized = val.replace(',', '.');
    return Number(normalized);
  }).pipe(z.number().gt(0, 'Ціна повинна бути більше 0')),
  label: z.enum(['top', 'new', 'none']).optional(),
  filePL: z.instanceof(File).nullable(),
  fileUA: z.instanceof(File).nullable(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const createBannerSchema = z.object({
  namePL: z.string().min(1, 'Назва (PL) обов\'язкова'),
  nameUA: z.string().min(1, 'Назва (UA) обов\'язкова'),
  imagePL: z.instanceof(File, { message: 'Фото (PL) обов\'язкове' }).nullable().refine(
    (file) => file !== null,
    { message: 'Фото (PL) обов\'язкове' }
  ),
  imageUA: z.instanceof(File, { message: 'Фото (UA) обов\'язкове' }).nullable().refine(
    (file) => file !== null,
    { message: 'Фото (UA) обов\'язкове' }
  ),
});

export type CreateBannerSchema = z.infer<typeof createBannerSchema>;

export const createModalSchema = z.object({
  name: z.string().min(1, 'Назва обов\'язкова'),
  description: z.string().min(1, 'Опис обов\'язковий'),
  enabled: z.boolean(),
});

export type CreateModalSchema = z.infer<typeof createModalSchema>;