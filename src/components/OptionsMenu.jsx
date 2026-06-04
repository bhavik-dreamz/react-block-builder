import React, { useState, useRef, useEffect } from 'react';
import { serialize } from '@wordpress/blocks';
import { useEditor } from '../context/EditorContext';
import { FaCheck, FaEllipsisV } from 'react-icons/fa';

export default function OptionsMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const {
        blocks,
        editorMode, setEditorMode,
        fullscreen, setFullscreen,
        spotlightMode, setSpotlightMode,
        distractionFree, setDistractionFree,
        topToolbar, setTopToolbar,
    } = useEditor();

    // Close on outside click
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Sync body classes for view modes
    useEffect(() => {
        document.body.classList.toggle('is-fullscreen-mode', fullscreen);
        document.body.classList.toggle('is-spotlight-mode', spotlightMode);
        document.body.classList.toggle('is-distraction-free', distractionFree);
        document.body.classList.toggle('has-top-toolbar', topToolbar);
    }, [fullscreen, spotlightMode, distractionFree, topToolbar]);

    function handleCopyAllBlocks() {
        const html = serialize(blocks);
        navigator.clipboard.writeText(html).then(() => {
            setOpen(false);
        });
    }

    function toggle(setter, current) {
        setter(!current);
    }

    return (
        <div className="options-menu-wrap" ref={menuRef}>
            <button
                className="options-menu-btn header-btn-wrap"
                title="Options"
                onClick={() => setOpen((v) => !v)}
            >
                <FaEllipsisV />
            </button>

            {open && (
                <div className="options-menu-dropdown">
                    {/* VIEW */}
                    <div className="options-menu-section-label">VIEW</div>

                    <button
                        className="options-menu-item"
                        onClick={() => { toggle(setTopToolbar, topToolbar); }}
                    >
                        <span className="components-menu-item-item">
                            <div className='components-menu-item-info-wrapper'>
                                <span>Top toolbar</span>
                                <span className="options-menu-desc">Access all block and document tools in a single place</span>
                            </div>
                        </span>
                        {topToolbar && <FaCheck className="options-menu-check" />}
                    </button>

                    <button
                        className="options-menu-item"
                        onClick={() => { toggle(setDistractionFree, distractionFree); }}
                    >
                        <span className="components-menu-item-item">
                            <div className='components-menu-item-info-wrapper'>
                                <span>Distraction free</span>
                                <span className="options-menu-desc">Write with calmness</span>
                            </div>
                        </span>
                        {distractionFree && <FaCheck className="options-menu-check" />}
                    </button>

                    <button
                        className="options-menu-item"
                        onClick={() => { toggle(setSpotlightMode, spotlightMode); }}
                    >
                        <span className="components-menu-item-item">
                            <div className='components-menu-item-info-wrapper'>
                                <span>Spotlight mode</span>
                                <span className="options-menu-desc">Focus on one block at a time</span>
                            </div>
                        </span>
                        {spotlightMode && <FaCheck className="options-menu-check" />}
                    </button>

                    <button
                        className="options-menu-item"
                        onClick={() => { toggle(setFullscreen, fullscreen); setOpen(false); }}
                    >
                        <span className="components-menu-item-item">
                            <div className='components-menu-item-info-wrapper'>
                                <span>Fullscreen mode</span>
                                <span className="options-menu-desc">Show and hide the admin interface</span>
                            </div>
                        </span>
                        {fullscreen && <FaCheck className="options-menu-check" />}
                    </button>

                    <div className="options-menu-divider" />

                    {/* EDITOR */}
                    <div className="options-menu-section-label">EDITOR</div>

                    <button
                        className="options-menu-item"
                        onClick={() => { setEditorMode('visual'); setOpen(false); }}
                    >
                        <span className="components-menu-item-item">
                            <div className='components-menu-item-info-wrapper'>
                                <span>Visual editor</span>
                            </div>
                        </span>
                        {editorMode === 'visual' && <FaCheck className="options-menu-check" />}
                    </button>

                    <button
                        className="options-menu-item"
                        onClick={() => { setEditorMode('code'); setOpen(false); }}
                    >
                        <span className="components-menu-item-item">
                            <div className='components-menu-item-info-wrapper'>
                                <span>Code editor</span>
                            </div>
                        </span>
                        {editorMode === 'code' && <FaCheck className="options-menu-check" />}
                    </button>

                    <div className="options-menu-divider" />

                    {/* TOOLS */}
                    <div className="options-menu-section-label">TOOLS</div>

                    <button
                        className="options-menu-item"
                        onClick={handleCopyAllBlocks}
                    >
                        <span className="components-menu-item-item">
                            <span>Copy all blocks</span>
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}