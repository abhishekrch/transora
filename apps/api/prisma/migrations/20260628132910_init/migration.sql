-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "api_key" VARCHAR(64) NOT NULL,
    "default_language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "allowed_languages" TEXT[],
    "rate_limit_per_min" INTEGER NOT NULL DEFAULT 100,
    "daily_char_limit" INTEGER NOT NULL DEFAULT 100000,
    "switcher_position" VARCHAR(20) NOT NULL DEFAULT 'bottom-right',
    "switcher_style" VARCHAR(20) NOT NULL DEFAULT 'dropdown',
    "seo_hreflang" BOOLEAN NOT NULL DEFAULT true,
    "seo_meta_translate" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "source_hash" VARCHAR(64) NOT NULL,
    "source_text" TEXT NOT NULL,
    "source_lang" VARCHAR(10) NOT NULL,
    "target_lang" VARCHAR(10) NOT NULL,
    "translated_text" TEXT NOT NULL,
    "char_count" INTEGER NOT NULL,
    "is_personal" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP,
    "hit_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "glossary" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "source_text" TEXT NOT NULL,
    "target_lang" VARCHAR(10) NOT NULL,
    "translated_text" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(50) NOT NULL,
    "resource_type" VARCHAR(50),
    "resource_id" UUID,
    "outcome" VARCHAR(20) NOT NULL DEFAULT 'success',
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "total_translations" INTEGER NOT NULL DEFAULT 0,
    "cache_hits" INTEGER NOT NULL DEFAULT 0,
    "cache_misses" INTEGER NOT NULL DEFAULT 0,
    "azure_calls" INTEGER NOT NULL DEFAULT 0,
    "chars_translated" INTEGER NOT NULL DEFAULT 0,
    "unique_languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unique_pages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "websites_api_key_key" ON "websites"("api_key");

-- CreateIndex
CREATE INDEX "websites_user_id_idx" ON "websites"("user_id");

-- CreateIndex
CREATE INDEX "websites_api_key_idx" ON "websites"("api_key");

-- CreateIndex
CREATE INDEX "translations_website_id_idx" ON "translations"("website_id");

-- CreateIndex
CREATE INDEX "translations_target_lang_idx" ON "translations"("target_lang");

-- CreateIndex
CREATE INDEX "translations_expires_at_idx" ON "translations"("expires_at") WHERE (expires_at IS NOT NULL);

-- CreateIndex
CREATE UNIQUE INDEX "translations_website_id_source_hash_target_lang_key" ON "translations"("website_id", "source_hash", "target_lang");

-- CreateIndex
CREATE UNIQUE INDEX "glossary_website_id_source_text_target_lang_key" ON "glossary"("website_id", "source_text", "target_lang");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "audit_log"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- CreateIndex
CREATE INDEX "audit_log_user_id_created_at_idx" ON "audit_log"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_website_id_date_key" ON "daily_stats"("website_id", "date");

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary" ADD CONSTRAINT "glossary_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
