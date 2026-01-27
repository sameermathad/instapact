"use client"
import { useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bold, Italic, List, ListOrdered } from "lucide-react"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm focus:outline-none min-h-[120px] max-w-none px-3 py-2 text-slate-700 leading-normal [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 prose-headings:font-bold prose-headings:text-slate-900',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-200 rounded-md overflow-hidden bg-white focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 transition-all">
      <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/50 p-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
