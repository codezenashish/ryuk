"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SlashCommand } from "../util/editor-extensions";
import { getSuggestionItems } from "../util/editor-extensions";
import { CommandList } from "./command-list";
import { useNoteStore } from "@/store/useNoteStore";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css"; 

interface EditorProps {
  noteId: string;
}

export default function NoteEditor({ noteId }: EditorProps) {
  const { notes, updateNote } = useNoteStore();
  const currentNote = notes.find((n) => n.id === noteId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new ReactRenderer(CommandList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },

              onUpdate(props: any) {
                component?.updateProps(props);
                if (!props.clientRect) return;
                popup?.[0]?.setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },

              onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                  popup?.[0]?.hide();
                  return true;
                }
                return component?.ref?.onKeyDown(props) || false;
              },

              onExit() {
                popup?.[0]?.destroy();
                component?.destroy();
              },
            };
          },
        },
      }),
    ],
    content:
      currentNote?.content ||
      "<p>Type / to open block styling layouts blueprints...</p>",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none max-w-none text-zinc-300 min-h-[300px] text-sm leading-relaxed whitespace-pre-wrap",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateNote(noteId, { content: html });
    },
  });

  
  useEffect(() => {
    if (editor && currentNote) {
      const currentHtml = editor.getHTML();
      if (currentNote.content !== currentHtml && currentNote.content !== "") {
        editor.commands.setContent(currentNote.content);
      }
    }
  }, [noteId, editor]);

  if (!currentNote) return null;

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={currentNote.title}
        onChange={(e) => updateNote(noteId, { title: e.target.value })}
        placeholder="Untitled"
        className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-zinc-100 outline-none placeholder:text-zinc-800 focus:ring-0"
      />

      <div className="min-h-87.5 rounded-xl border border-zinc-900 bg-zinc-950/40 p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
