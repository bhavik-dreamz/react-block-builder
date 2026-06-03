import React from "react";

export const TemplateIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="6" y="6" width="12" height="3" stroke="currentColor" strokeWidth="2" />
        <rect x="6" y="11" width="5" height="7" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="11" width="5" height="7" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const DocumentOverviewIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" {...props}>
        <path d="M3 6h11v1.5H3V6Zm3.5 5.5h11V13h-11v-1.5ZM21 17H10v1.5h11V17Z"></path>
    </svg>
);