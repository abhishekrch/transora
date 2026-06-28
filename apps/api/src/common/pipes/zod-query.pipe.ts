import { PipeTransform, BadRequestException } from "@nestjs/common";
import { z } from "zod";

export class ZodQueryPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: Record<string, string>) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: "Invalid query parameters",
        error: "BAD_REQUEST",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}
