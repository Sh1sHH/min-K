import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, placeholder }, ref) => {
    const quillRef = useRef<ReactQuill>(null);

    useImperativeHandle(ref, () => ({
      ...quillRef.current,
      getEditor: () => quillRef.current?.getEditor()
    }));

    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean'],
        ]
      }
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'list', 'bullet',
      'align',
      'link', 'image',
      'color', 'background',
    ];

    return (
      <div className="relative">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white rounded-lg"
        />
        <style>
          {`
            .ql-toolbar {
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
              background-color: white;
              border-color: #e2e8f0;
            }
            .ql-container {
              border-bottom-left-radius: 0.5rem;
              border-bottom-right-radius: 0.5rem;
              background-color: white;
              border-color: #e2e8f0;
              min-height: 200px;
            }
            .ql-editor {
              min-height: 200px;
              font-size: 1rem;
              line-height: 1.5;
              color: black;
            }
            .ql-editor.ql-blank::before {
              color: #94a3b8;
              font-style: normal;
            }

            .ql-picker-options {
              z-index: 9999;
            }
          `}
        </style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
