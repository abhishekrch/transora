import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AppConfig } from "@/config/app.config";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor(private config: AppConfig) {
    const adapter = new PrismaPg({
      connectionString: this.config.databaseUrl,
    });
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Delegate all Prisma methods
  get user() {
    return this.prisma.user;
  }

  get website() {
    return this.prisma.website;
  }

  get translation() {
    return this.prisma.translation;
  }

  get glossary() {
    return this.prisma.glossary;
  }

  get auditLog() {
    return this.prisma.auditLog;
  }

  get dailyStats() {
    return this.prisma.dailyStats;
  }

  get $transaction() {
    return this.prisma.$transaction.bind(this.prisma);
  }

  get $queryRaw() {
    return this.prisma.$queryRaw.bind(this.prisma);
  }

  get $executeRaw() {
    return this.prisma.$executeRaw.bind(this.prisma);
  }
}
