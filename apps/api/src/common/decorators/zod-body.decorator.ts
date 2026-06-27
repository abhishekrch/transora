import { Body } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";

export const ZodBody = (schema: z.ZodType) =>
  Body(new ZodValidationPipe(schema));
