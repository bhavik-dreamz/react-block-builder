import React from 'react';
import { useEditor } from '../context/EditorContext';
import logoimage from '../images/editor-icon.png';
import { FaColumns, FaEye, FaEdit, FaTrash, FaSave, FaGlobe, FaDesktop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';

const DEVICES = [
  { id: 'desktop', Icon: FaDesktop, label: 'Desktop' },
  { id: 'tablet', Icon: FaTabletAlt, label: 'Tablet' },
  { id: 'mobile', Icon: FaMobileAlt, label: 'Mobile' },
];
import OptionsMenu from './OptionsMenu';
import LeftToolbarButtonSet from './LeftToolbarButtonSet';

export default function Header() {
  const {
    preview, setPreview,
    saved,
    sidebarOpen, setSidebarOpen,
    pageTitle, setPageTitle,
    handleSave,
    handleClear,
    onViewSite,
    deviceType, setDeviceType,
    devices,
    headerButtons = {},
  } = useEditor();

  const allowedDevices = devices?.length
    ? DEVICES.filter((d) => devices.includes(d.id))
    : DEVICES;

  return (
    <div className="editor-header">
      <div className="fp-editor-title-row">
        <a href="/">
          <div className="logo-image">
            <img src={logoimage} alt="Logo" />
          </div>
        </a>
        <LeftToolbarButtonSet />
      </div>
      <div className="header-center">
        <input
          className="page-title-input"
          value={pageTitle}
          onChange={e => setPageTitle(e.target.value)}
          placeholder="Page title…"
        />
      </div>
      <div className="header-actions">
        {headerButtons.deviceSwitcher !== false && !preview && allowedDevices.length > 1 && (
          <div className="device-switcher" role="group" aria-label="Preview device">
            {allowedDevices.map(({ id, Icon, label }) => (
              <button
                key={id}
                className={`device-btn header-btn-wrap${deviceType === id ? ' active' : ''}`}
                onClick={() => setDeviceType(id)}
                title={label}
                aria-pressed={deviceType === id}
              >
                <Icon />
              </button>
            ))}
          </div>
        )}

        {headerButtons.sidebar !== false && (
          <button className="sidebar-toggle-btn header-btn-wrap" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaColumns />
          </button>
        )}

        {headerButtons.preview !== false && (
          <button className="preview-btn header-btn-wrap" onClick={() => setPreview(!preview)}>
            {preview ? <FaEdit /> : <FaEye />}
          </button>
        )}

        {headerButtons.clear !== false && (
          <button className="clear-btn header-btn-wrap" onClick={handleClear}>
            <FaTrash />
          </button>
        )}

        {headerButtons.save !== false && (
          <button className="save-btn header-btn-wrap" onClick={handleSave}>
            <FaSave />
            {saved ? '' : ''}
          </button>
        )}

        {headerButtons.viewSite !== false && (
          <button className="view-site-btn" onClick={onViewSite} title="View the saved page as a visitor would see it">
            <FaGlobe />
            View Site
          </button>
        )}

        {headerButtons.options !== false && <OptionsMenu />}
      </div>
    </div>
  );
}