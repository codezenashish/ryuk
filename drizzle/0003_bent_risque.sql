CREATE TABLE "note_version" (
	"id" text PRIMARY KEY NOT NULL,
	"noteId" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"language" text DEFAULT 'plaintext',
	"isSnippet" boolean DEFAULT false NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "note_version" ADD CONSTRAINT "note_version_noteId_note_id_fk" FOREIGN KEY ("noteId") REFERENCES "public"."note"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_version" ADD CONSTRAINT "note_version_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "note_version_note_id_idx" ON "note_version" USING btree ("noteId");--> statement-breakpoint
CREATE INDEX "note_version_user_id_idx" ON "note_version" USING btree ("userId");