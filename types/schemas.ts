import z from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (value) => {
        const clean = value.replace(/\D/g, "");
        const isPL = clean.length === 9;
        const isUA = value.startsWith("+380") && clean.length === 12;
        return isPL || isUA;
      },
      {
        message: "Invalid phone number",
      }
    ),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Назва обов\'язкова'),
  category: z.enum(['chilled', 'frozen', 'ready', 'marinated', 'snacks', 'other'], {
    message: 'Категорія обов\'язкова',
  }),
  description: z.string().min(1, 'Опис обов\'язковий'),
  gramsPerServing: z.coerce.number().min(1, 'Вага повинна бути більше 0'),
  quantityPerServing: z.coerce.number().min(1, 'Кількість повинна бути більше 0'),
  price: z.string().transform((val) => {
    const normalized = val.replace(',', '.');
    return Number(normalized);
  }).pipe(z.number().gt(0, 'Ціна повинна бути більше 0')),
  label: z.enum(['top', 'new', 'none']).optional(),
  file: z.instanceof(File).nullable(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const createBannerSchema = z.object({
  name: z.string().min(1, 'Назва обов\'язкова'),
  image: z.instanceof(File, { message: 'Фото обов\'язкове' }).nullable().refine(
    (file) => file !== null,
    { message: 'Фото обов\'язкове' }
  ),
});

export type CreateBannerSchema = z.infer<typeof createBannerSchema>;

export const createModalSchema = z.object({
  name: z.string().min(1, 'Назва обов\'язкова'),
  description: z.string().min(1, 'Опис обов\'язковий'),
  enabled: z.boolean(),
});

export type CreateModalSchema = z.infer<typeof createModalSchema>;