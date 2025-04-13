import { useState, useEffect, useRef } from "react";
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, backgroundColor = "#202e39" }) => {
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
          toolbar: {
            container: toolbarRef.current,
            handlers: {
              // Explicitly define toggles for key formatting options
              bold: function(value) {
                const format = this.quill.getFormat();
                this.quill.format('bold', !format.bold);
              },
              italic: function(value) {
                const format = this.quill.getFormat();
                this.quill.format('italic', !format.italic);
              },
              underline: function(value) {
                const format = this.quill.getFormat();
                this.quill.format('underline', !format.underline);
              },
              strike: function(value) {
                const format = this.quill.getFormat();
                this.quill.format('strike', !format.strike);
              }
            }
          }
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
      
      // Handle toolbar clicks to ensure proper toggling
      const toolbar = quillRef.current.getModule('toolbar');
      toolbar.addHandler('bold', function() {
        const format = quillRef.current.getFormat();
        quillRef.current.format('bold', !format.bold);
      });
      
      toolbar.addHandler('italic', function() {
        const format = quillRef.current.getFormat();
        quillRef.current.format('italic', !format.italic);
      });
      
      toolbar.addHandler('underline', function() {
        const format = quillRef.current.getFormat();
        quillRef.current.format('underline', !format.underline);
      });
      
      toolbar.addHandler('strike', function() {
        const format = quillRef.current.getFormat();
        quillRef.current.format('strike', !format.strike);
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
          background-color: ${backgroundColor};
          border-color: ${backgroundColor};
        }
        
        .ql-container.ql-snow {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          background-color: ${backgroundColor};
          border-color: ${backgroundColor};
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

        /* Active button states */
        .ql-toolbar button.ql-active,
        .ql-toolbar .ql-picker-label.ql-active {
          background-color: rgba(0, 132, 255, 0.3) !important;
          border-radius: 0.25rem;
        }
        
        .ql-toolbar button:hover,
        .ql-toolbar .ql-picker-label:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.25rem;
        }
        
        /* Active format indicators */
        .ql-toolbar button.ql-active .ql-stroke,
        .ql-toolbar .ql-picker-label.ql-active .ql-stroke {
          stroke: #0084ff !important;
        }
        
        .ql-toolbar button.ql-active .ql-fill,
        .ql-toolbar .ql-picker-label.ql-active .ql-fill {
          fill: #0084ff !important;
        }
        
        .ql-toolbar .ql-picker-label.ql-active {
          color: #0084ff !important;
        }
        
        /* Dropdown active states */
        .ql-toolbar .ql-picker-item.ql-selected {
          color: #0084ff !important;
        }
        
        /* Format-specific active states */
        .ql-toolbar button.ql-bold.ql-active,
        .ql-toolbar button.ql-italic.ql-active,
        .ql-toolbar button.ql-underline.ql-active,
        .ql-toolbar button.ql-strike.ql-active {
          color: #0084ff !important;
        }
      `}</style>
      
      {/* Explicitly define the toolbar container */}
      <div ref={toolbarRef} className="quill-toolbar">
        <span className="ql-formats">
          <button className="ql-bold" data-toggle="true"></button>
          <button className="ql-italic" data-toggle="true"></button>
          <button className="ql-underline" data-toggle="true"></button>
          <button className="ql-strike" data-toggle="true"></button>
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