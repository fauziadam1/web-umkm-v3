import z from "zod";

export const ContainNumber = (value) => /\b/.test(value);

export const ContainUpperCase = (value) => /[A-B]/.test(value);

export const ContainSpecialChar = (value) => {
  const specialChar = /[`!@#$%^&*()_+[\]{};':"\\|,.<>/?~]/;

  return specialChar.test(value);
};

export const PasswordSchema = z.string().superRefine((value, ctx) => {
  if (value.length < 6) {
    ctx.addIssue({
      code: "custom",
      message: "Minimal 6 karakter",
    });

    return z.NEVER;
  }

  if (value.length > 13) {
    ctx.addIssue({
      code: "custom",
      message: "Maksimal 13 karakter",
    });

    return z.NEVER;
  }

  if (!ContainUpperCase(value)) {
    ctx.addIssue({
      code: "custom",
      message: "Setidaknya berisi 1 huruf kapital",
    });

    return z.NEVER;
  }

  if (!ContainNumber(value)) {
    ctx.addIssue({
      code: "custom",
      message: "Setidaknya berisi 1 angka",
    });

    return z.NEVER;
  }

  if (!ContainSpecialChar(value)) {
    ctx.addIssue({
      code: "custom",
      message: "Setidaknya berisi 1 spesial karakter (@, #, $, dst)",
    });

    return z.NEVER;
  }
});
