import { ActionBuilderProvider } from './ActionBuilderContext.jsx';

export function ActionBuilderSetup({ actions, children }) {
  if (!actions) {
    return children;
  }

  return (
    <ActionBuilderProvider actions={actions}>
      {children}
    </ActionBuilderProvider>
  );
}
