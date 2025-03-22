import { useState, useEffect, useRef } from "react";
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const quillRef = useRef(null);
  const [editorContent, setEditorContent] = useState(value || '');

  useEffect(() => {
    if (!editorRef.current || !toolbarRef.current) return;
    
    // Import Quill dynamically (client-side only)
    import('quill').then(Quill => {
      // Configure toolbar options
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ];

      // Initialize Quill with a reference to our toolbar container
      quillRef.current = new Quill.default(editorRef.current, {
        modules: {
          toolbar: toolbarRef.current
        },
        placeholder: placeholder || 'Tekstas...',
        theme: 'snow'
      });

      // Set initial content if any
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Handle text change
      quillRef.current.on('text-change', () => {
        const content = quillRef.current.root.innerHTML;
        setEditorContent(content);
        if (onChange) {
          onChange(content);
        }
      });
    });

    // Cleanup on unmount
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
      }
    };
  }, []);

  // Handle content updates from parent component
  useEffect(() => {
    if (quillRef.current && value !== editorContent) {
      quillRef.current.root.innerHTML = value;
      setEditorContent(value);
    }
  }, [value]);

  return (
    <div className="rich-text-editor-container">
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #202e39;
          border-color: #202e39;
        }
        
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          background-color: #202e39;
          border-color: #202e39;
          min-height: 160px;
        }
        
        .ql-editor {
          color: white;
          min-height: 160px;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }
        
        .ql-picker {
          color: white !important;
        }
        
        .ql-stroke {
          stroke: white !important;
        }
        
        .ql-fill {
          fill: white !important;
        }
        
        .ql-picker-options {
          background-color: #1e1e1e !important;
          color: white !important;
        }
      `}</style>
      
      {/* Explicitly define the toolbar container */}
      <div ref={toolbarRef} className="quill-toolbar">
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-header">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
            <option value="">Normal</option>
          </select>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-clean"></button>
        </span>
      </div>
      
      {/* Editor container */}
      <div ref={editorRef} className="quill-editor"></div>
    </div>
  );
};

export default RichTextEditor;