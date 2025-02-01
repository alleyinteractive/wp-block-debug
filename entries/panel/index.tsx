/**
 * Entry for panel.
 */

// WordPress dependencies.
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

// Internal dependencies.
import Panel from './panel';

// Import styles.
import './index.scss';

addFilter(
  'editor.BlockEdit',
  'wp-block-debug/panel',
  createHigherOrderComponent((BlockEdit) => function withDebugPanel(props: Object) {
    return (
      <>
        <BlockEdit {...props} />
        {/* @ts-ignore */}
        <Panel {...props} />
      </>
    );
  }, 'withDebugPanel'),
  100,
);
