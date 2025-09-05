"use client";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { useEffect, useRef } from 'react';
import type { Editor } from '@ckeditor/ckeditor5-core';

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomCKEditor({ 
  value, 
  onChange, 
  placeholder = "توضیحات محصول را وارد کنید...",
  disabled = false,
  className = ""
}: CKEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    // Set RTL direction for Persian text
    if (editorRef.current?.editing?.view?.document?.getRoot()) {
      const root = (editorRef.current as any).editing.view.document.getRoot();
      if (root) {
        root._setAttribute('dir', 'rtl');
      }
    }
  }, []);

  const editorConfig: any = {
    language: 'fa',
    direction: 'rtl',
    placeholder: placeholder,
    // Fix paragraph and list behavior
    enterMode: 'ENTER_BR',
    shiftEnterMode: 'ENTER_P',
    // Ensure proper block element handling
    blockToolbar: [
      'heading',
      'bulletedList',
      'numberedList',
      'blockQuote'
    ],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'alignment',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'indent',
        'outdent',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'پاراگراف', class: 'ck-heading_paragraph' },
        { model: 'heading1' as const, view: 'h1', title: 'عنوان 1', class: 'ck-heading_heading1' },
        { model: 'heading2' as const, view: 'h2', title: 'عنوان 2', class: 'ck-heading_heading2' },
        { model: 'heading3' as const, view: 'h3', title: 'عنوان 3', class: 'ck-heading_heading3' },
        { model: 'heading4' as const, view: 'h4', title: 'عنوان 4', class: 'ck-heading_heading4' },
        { model: 'heading5' as const, view: 'h5', title: 'عنوان 5', class: 'ck-heading_heading5' },
        { model: 'heading6' as const, view: 'h6', title: 'عنوان 6', class: 'ck-heading_heading6' }
      ]
    },
    fontSize: {
      options: [
        'tiny',
        'small',
        'default',
        'big',
        'huge'
      ]
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        'B Nazanin',
        'B Titr',
        'B Yekan',
        'B Zar',
        'Bardiya',
        'Ferdosi',
        'Homa',
        'Koodak',
        'Lotus',
        'Mitra',
        'Narm',
        'Nazanin',
        'Tahoma',
        'Titr',
        'Traffic',
        'Yekan',
        'Zar'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ]
    },
    fontColor: {
      colors: [
        { label: 'مشکی', color: '#000000' },
        { label: 'سفید', color: '#ffffff' },
        { label: 'قرمز', color: '#ff0000' },
        { label: 'سبز', color: '#00ff00' },
        { label: 'آبی', color: '#0000ff' },
        { label: 'زرد', color: '#ffff00' },
        { label: 'نارنجی', color: '#ffa500' },
        { label: 'بنفش', color: '#800080' },
        { label: 'صورتی', color: '#ffc0cb' },
        { label: 'قهوه‌ای', color: '#a52a2a' },
        { label: 'خاکستری تیره', color: '#404040' },
        { label: 'خاکستری روشن', color: '#c0c0c0' },
        { label: 'آبی تیره', color: '#000080' },
        { label: 'سبز تیره', color: '#008000' },
        { label: 'قرمز تیره', color: '#800000' },
        { label: 'زرد تیره', color: '#808000' }
      ],
      columns: 8,
      documentColors: 12
    },
    fontBackgroundColor: {
      colors: [
        { label: 'مشکی', color: '#000000' },
        { label: 'سفید', color: '#ffffff' },
        { label: 'قرمز روشن', color: '#ffcccc' },
        { label: 'سبز روشن', color: '#ccffcc' },
        { label: 'آبی روشن', color: '#cce5ff' },
        { label: 'زرد روشن', color: '#ffffcc' },
        { label: 'نارنجی روشن', color: '#ffe6cc' },
        { label: 'بنفش روشن', color: '#e6ccff' },
        { label: 'صورتی روشن', color: '#ffe6f2' },
        { label: 'قهوه‌ای روشن', color: '#f2e6cc' },
        { label: 'خاکستری روشن', color: '#f0f0f0' },
        { label: 'آبی آسمانی', color: '#87ceeb' },
        { label: 'سبز زیتونی', color: '#6b8e23' },
        { label: 'قرمز گوجه‌ای', color: '#ff6347' },
        { label: 'زرد طلایی', color: '#ffd700' },
        { label: 'نارنجی هویجی', color: '#ff8c00' }
      ],
      columns: 8,
      documentColors: 12
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://'
    },
    mediaEmbed: {
      previewsInData: true
    },
    // Fix list and heading behavior
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },
    // Ensure proper paragraph handling
    paragraph: {
      indentBlock: {
        offset: 1,
        unit: 'em'
      }
    }
  };

  return (
    <div className={`ckeditor-container ${className}`}>
             <CKEditor
         editor={DecoupledEditor as any}
         config={editorConfig}
         data={value}
         disabled={disabled}
                   onReady={(editor) => {
            // Set RTL direction
            editor.editing.view.change((writer) => {
              const root = editor.editing.view.document.getRoot();
              if (root) {
                writer.setAttribute('dir', 'rtl', root);
              }
            });
            
            // Store editor reference
            editorRef.current = editor as any;
            
            // Fix list and heading behavior
            editor.editing.view.document.on('enter', (evt, data) => {
              // Ensure proper paragraph creation on Enter
              const selection = editor.model.document.selection;
              const position = selection.getFirstPosition();
              
              if (position) {
                const element = position.parent;
                
                // If we're in a list item, create a new list item
                if (element.name === 'listItem') {
                  editor.execute('enter');
                  data.preventDefault();
                  return;
                }
                
                // If we're in a heading, create a new paragraph
                if (element.name && element.name.startsWith('heading')) {
                  editor.execute('enter');
                  data.preventDefault();
                  return;
                }
              }
            });
            
            // Additional fix for list and heading behavior
            editor.model.document.on('change:data', () => {
              // Ensure proper element separation
              const selection = editor.model.document.selection;
              const position = selection.getFirstPosition();
              
              if (position) {
                const element = position.parent;
                
                // If we're in a list item, ensure it's properly separated
                if (element.name === 'listItem') {
                  const nextElement = (position as any).getNextSibling();
                  if (nextElement && nextElement.name !== 'listItem') {
                    // Insert a paragraph after the list
                    editor.model.change(writer => {
                      const paragraph = writer.createElement('paragraph');
                      writer.insert(paragraph, (position as any).getNextSibling());
                    });
                  }
                }
              }
            });
            
            // Insert toolbar into the DOM
            const toolbarElement = editor.ui.view.toolbar?.element;
            const editorElement = editor.ui.view.editable.element;
            
            if (toolbarElement && editorElement) {
              // Remove existing toolbar if any
              const existingToolbar = document.querySelector('.ck-toolbar-container');
              if (existingToolbar) {
                existingToolbar.remove();
              }
              
              // Create toolbar container
              const toolbarContainer = document.createElement('div');
              toolbarContainer.className = 'ck-toolbar-container';
              toolbarContainer.appendChild(toolbarElement);
              
              // Insert toolbar before editor
              editorElement.parentNode?.insertBefore(toolbarContainer, editorElement);
            }
          }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        onBlur={(event, editor) => {
          // Additional blur handling if needed
        }}
        onFocus={(event, editor) => {
          // Additional focus handling if needed
        }}
      />
      
      <style jsx global>{`
        .ckeditor-container .ck-editor__editable {
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
          direction: rtl;
          text-align: right;
        }
        
        .ckeditor-container .ck-editor__editable.ck-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .ckeditor-container .ck-toolbar {
          border-radius: 0.5rem 0.5rem 0 0;
          border-color: #d1d5db;
        }
        
        .ckeditor-container .ck-editor__editable {
          border-radius: 0 0 0.5rem 0.5rem;
          border-color: #d1d5db;
        }
        
        .ckeditor-container .ck-button {
          border-radius: 0.375rem;
        }
        
        .ckeditor-container .ck-button.ck-on {
          background-color: #3b82f6;
          color: white;
        }
        
        .ckeditor-container .ck-button:hover:not(.ck-disabled) {
          background-color: #f3f4f6;
        }
        
        .ckeditor-container .ck-button.ck-on:hover:not(.ck-disabled) {
          background-color: #2563eb;
        }
        
        .ckeditor-container .ck-dropdown__panel {
          border-radius: 0.5rem;
          border-color: #d1d5db;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .ckeditor-container .ck-list__item {
          padding: 0.5rem 1rem;
        }
        
        .ckeditor-container .ck-list__item:hover {
          background-color: #f3f4f6;
        }
        
        .ckeditor-container .ck-list__item.ck-selected {
          background-color: #3b82f6;
          color: white;
        }
        
        .ckeditor-container .ck-input {
          border-radius: 0.375rem;
          border-color: #d1d5db;
        }
        
        .ckeditor-container .ck-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}
