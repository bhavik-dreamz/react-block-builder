import { Inserter } from "@wordpress/block-editor";
import React from "react";
import { LuUndo, LuRedo } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useEditor } from "../context/EditorContext";

export default function LeftToolbarButtonSet() {
  const {
    canUndo, canRedo,
    handleUndo, handleRedo,
    templatePickerOpen, setTemplatePickerOpen,
    listViewOpen, setListViewOpen,
  } = useEditor();

  return (
    <div className='editor-toolbar'>
      <Inserter
        rootClientId={undefined}
        clientId={undefined}
        isAppender
        renderToggle={({ onToggle }) => {
          const handleClick = () => {
            onToggle();
            document.body.classList.toggle("inserter-active");
          };

          return (
            <button
              className='toolbar-inserter-btn'
              onClick={handleClick}
              title='Add block'
            >
              <FaPlus />
            </button>
          );
        }}
      />

      <div className='toolbar-divider' />

      {/* Templates button */}
      <button
        className={`toolbar-btn${templatePickerOpen ? " active" : ""}`}
        onClick={() => setTemplatePickerOpen((o) => !o)}
        title='Insert a pre-built block template'
      >
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <rect x='3' y='3' width='18' height='18' rx='2' stroke='#0F172A' strokeWidth='2' />
          <rect x='6' y='6' width='12' height='3' stroke='#0F172A' strokeWidth='2' />
          <rect x='6' y='11' width='5' height='7' stroke='#0F172A' strokeWidth='2' />
          <rect x='13' y='11' width='5' height='7' stroke='#0F172A' strokeWidth='2' />
        </svg>
      </button>

      <div className='toolbar-divider' />

      {/* Undo / Redo */}
      <button className='toolbar-btn' onClick={handleUndo} disabled={!canUndo} title='Undo (Ctrl+Z)'>
        <LuUndo />
      </button>
      <button className='toolbar-btn' onClick={handleRedo} disabled={!canRedo} title='Redo (Ctrl+Y)'>
        <LuRedo />
      </button>

      {/* List View */}
      <button
        className={`toolbar-btn ${listViewOpen ? "active" : ""}`}
        onClick={() => setListViewOpen((prev) => !prev)}
        title='List View'
      >
        ☰
      </button>
    </div>
  );
}