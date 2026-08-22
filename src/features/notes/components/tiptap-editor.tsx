"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { Markdown } from "tiptap-markdown";
import { createLowlight, common } from "lowlight";
import { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  SquareCode,
  Link as LinkIcon,
  CheckSquare,
  Table as TableIcon,
} from "lucide-react";

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Type your note content... (Paste Markdown or type ``` for code block)",
  editable = true,
}: TipTapEditorProps) {
  const [bubbleCoords, setBubbleCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-400 underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: "-",
        linkify: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      BubbleMenuExtension,
    ],
    content: content || "",
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none p-0 min-h-[320px] focus:outline-none text-foreground text-base md:text-lg leading-relaxed font-sans",
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain");
        const html = event.clipboardData?.getData("text/html");

        if (text && !html) {
          const isHeading = view.state.selection.$head.parent.type.name === "heading";

          if (isHeading && text.includes("\n")) {
            event.preventDefault();
            if (editor) {
              editor.commands.splitBlock();
              editor.commands.insertContent(text);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor || !editable) return;

    const updateBubblePosition = () => {
      const { selection } = editor.state;

      if (selection.empty) {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowToolbar(false);
        setBubbleCoords(null);
        return;
      }

      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowToolbar(false);
        setBubbleCoords(null);
        return;
      }

      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = editorContainerRef.current?.getBoundingClientRect();

      if (rect && containerRect) {
        const rawLeft = rect.left - containerRect.left + rect.width / 2;
        const toolbarHalfWidth = toolbarRef.current
          ? toolbarRef.current.offsetWidth / 2
          : 210;
        const containerWidth = containerRect.width;

        const clampedLeft = Math.max(
          toolbarHalfWidth + 12,
          Math.min(containerWidth - toolbarHalfWidth - 12, rawLeft)
        );

        const calculatedTop = rect.top - containerRect.top - 52;
        const finalTop =
          calculatedTop < 10
            ? rect.bottom - containerRect.top + 10
            : calculatedTop;

        setBubbleCoords({
          top: finalTop,
          left: clampedLeft,
        });

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setShowToolbar(true);
        }, 180);
      }
    };

    editor.on("selectionUpdate", updateBubblePosition);
    editor.on("transaction", updateBubblePosition);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      editor.off("selectionUpdate", updateBubblePosition);
      editor.off("transaction", updateBubblePosition);
    };
  }, [editor, editable]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[300px] rounded-xl border border-border bg-card p-6 animate-pulse flex items-center justify-center text-muted-foreground text-sm font-mono">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div ref={editorContainerRef} className="w-full relative overflow-visible">
      {editable && bubbleCoords && (
        <div
          ref={toolbarRef}
          style={{
            top: `${bubbleCoords.top}px`,
            left: `${bubbleCoords.left}px`,
            transform: "translateX(-50%)",
          }}
          className={`absolute z-50 flex items-center gap-1 p-1.5 rounded-xl border border-border bg-card shadow-2xl backdrop-blur-xl text-foreground max-w-[92vw] overflow-x-auto scrollbar-none transition-all duration-200 ease-out ${
            showToolbar
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-1 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("bold") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("italic") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("underline") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("strike") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("code") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-border mx-0.5" />

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("heading", { level: 1 })
                ? "bg-background text-foreground shadow-xs"
                : ""
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("heading", { level: 2 })
                ? "bg-background text-foreground shadow-xs"
                : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("heading", { level: 3 })
                ? "bg-background text-foreground shadow-xs"
                : ""
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("bulletList") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("taskList") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Task List"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("blockquote") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("codeBlock") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Code Block"
          >
            <SquareCode className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            title="Insert Table"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer ${
              editor.isActive("link") ? "bg-background text-foreground shadow-xs" : ""
            }`}
            title="Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
