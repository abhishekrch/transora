import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
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
}
