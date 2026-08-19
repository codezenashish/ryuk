CREATE TABLE "category_collaborator" (
	"id" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"userId" text NOT NULL,
	"invitedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_collaborator" ADD CONSTRAINT "category_collaborator_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_collaborator" ADD CONSTRAINT "category_collaborator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_collaborator" ADD CONSTRAINT "category_collaborator_invitedBy_user_id_fk" FOREIGN KEY ("invitedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "category_collaborator_unique_idx" ON "category_collaborator" USING btree ("categoryId","userId");--> statement-breakpoint
CREATE INDEX "category_collaborator_user_id_idx" ON "category_collaborator" USING btree ("userId");