// lib/validation/hybridResolver.ts
import { FieldError, FieldValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncMap } from "@/types/auth";

// type AsyncValidator = (value: string) => Promise<string | boolean>;

// type AsyncMap = Record<string, AsyncValidator>;

export const hybridResolver =
  <T extends FieldValues>(schema: any, asyncMap: AsyncMap = {}): Resolver<T> =>
  async (values, context, options) => {
    // 1. Run Zod
    const baseResult = await zodResolver(schema)(values, context, options);

    // const errors = { ...base.errors };
    // Initialize errors from Zod result or empty object
    const errors: Record<string, any> = { ...baseResult.errors };

    // 2. Run async validators ONLY for dirty fields
    const asyncEntries = Object.entries(asyncMap);

    await Promise.all(
      asyncEntries.map(async ([name, validate]) => {
        const value = values[name];
        // Only run async validation if Zod hasn't already found an error for this field
        if (!value || errors[name]) return;

        try {
          const result = await validate(value);
          if (result !== true) {
            errors[name] = { type: "async", message: String(result) };
          }
        } catch (err) {
          // ✅ Aborted means superseded by a newer keystroke — not an error,
          // the next resolver invocation will validate the new value
          if (err instanceof Error && err.name === "AbortError") return;
          throw err;
        }

        // const result = await validate(value);
        // if (result !== true) {
        //   errors[name] = {
        //     type: "async",
        //     message: typeof result === "string" ? result : "Invalid value",
        //   };
        // }
      }),
    );

    // 3. Return the standard Resolver format
    // If there are any errors, 'values' should be an empty object
    const hasErrors = Object.keys(errors).length > 0;

    return {
      values: hasErrors ? {} : values,
      errors: errors,
    };

    // // 1. Run Zod
    // const zodResult = await zodResolver(schema)(values, context, options);

    // const errors = { ...zodResult.errors };

    // // 2. Run async validators ONLY for dirty fields
    // const asyncEntries = Object.entries(asyncMap);

    // await Promise.all(
    //   asyncEntries.map(async ([name, validate]) => {
    //     const value = values[name];

    //     if (!value) return;

    //     const result = await validate(value);

    //     if (result !== true) {
    //       errors[name] = {
    //         type: "async",
    //         message: result,
    //       };
    //     }
    //   }),
    // );

    // return {
    //   values,
    //   errors,
    // };
  };

export default hybridResolver;
