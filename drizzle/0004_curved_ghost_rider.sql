ALTER TABLE "category" ADD COLUMN "isShared" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "shareToken" text;--> statement-breakpoint
CREATE INDEX "category_share_token_idx" ON "category" USING btree ("shareToken");--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_shareToken_unique" UNIQUE("shareToken");