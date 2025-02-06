// External dependencies.
import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { getDefaultFormState } from '@rjsf/utils';

// WordPress dependencies.
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { serialize, BlockEditProps } from '@wordpress/blocks';
import {
  Button,
  Modal,
  PanelBody,
  __experimentalTruncate as Truncate,
} from '@wordpress/components';
import { useCopyToClipboard } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

// Local interfaces.
interface EditProps extends BlockEditProps<any> {
  name: string;
}

// Local helpers.
const PANEL_NAME = 'wp-block-debug';
const toEditableProperties = (carry: any, [key, value]: [string, any]) => {
  const allowedTypes = ['string', 'number', 'integer', 'boolean', 'object', 'array', 'null'];

  const typeIsAllowedString = typeof value.type === 'string' && allowedTypes.includes(value.type);
  const typeIsAllowedArray = (
    Array.isArray(value.type)
    && value.type.every((type: string) => allowedTypes.includes(type))
  );

  if (!(typeIsAllowedString || typeIsAllowedArray)) {
    return carry;
  }

  if (key === 'lock') {
    return carry;
  }

  if (value.type === 'array' && !value.items) {
    return carry;
  }

  return {
    ...carry,
    [key]: value,
  };
};

function Panel({
  name,
  attributes,
  setAttributes,
  clientId,
}: EditProps) {
  // Core selectors.
  const panelOpen = useSelect((select) => (select('core/editor') as any).isEditorPanelOpened(PANEL_NAME), []);
  const blockInstance = useSelect((select) => (select('core/block-editor') as any).getBlock(clientId), [clientId]);
  const blockType = useSelect((select) => (select('core/blocks') as any).getBlockType(blockInstance.name), [blockInstance.name]);
  const blockProps = useBlockProps();
  const serializedBlock = serialize(blockInstance);

  // Core dispatchers.
  const { toggleEditorPanelOpened } = useDispatch('core/editor');
  const { createNotice } = useDispatch('core/notices');

  // Local state.
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  // Helper values.
  const formProperties = Object.entries(blockType.attributes).reduce(toEditableProperties, {});
  const openModal = (content: string) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <>
      <InspectorControls>
        <PanelBody
          title={__('Debug', 'wp-block-debug')}
          opened={panelOpen}
          onToggle={() => toggleEditorPanelOpened(PANEL_NAME)}
        >
          <section>
            <h3 className="screen-reader-text">{__('Copy', 'wp-block-debug')}</h3>

            <ul>
              <li>
                <Button
                  variant="link"
                  ref={useCopyToClipboard(
                    name,
                    () => createNotice('info', __('Copied name to clipboard.', 'wp-block-debug'), {
                      isDismissible: true,
                      type: 'snackbar',
                    }),
                  )}
                >
                  {__('Copy block name', 'wp-block-debug')}
                </Button>
              </li>

              <li>
                <Button
                  variant="link"
                  ref={useCopyToClipboard(
                    clientId,
                    () => createNotice('info', __('Copied client ID to clipboard.', 'wp-block-debug'), {
                      isDismissible: true,
                      type: 'snackbar',
                    }),
                  )}
                >
                  {__('Copy client ID', 'wp-block-debug')}
                </Button>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="screen-reader-text">{__('Inspect', 'wp-block-debug')}</h3>

            <ul>
              <li>
                <Button
                  variant="link"
                  onClick={() => openModal(JSON.stringify(blockInstance, null, 2))}
                >
                  {__('Dump block instance', 'wp-block-debug')}
                </Button>
              </li>

              <li>
                <Button
                  variant="link"
                  onClick={() => {
                    const blockTypeForModal = {
                      ...blockType,
                      icon: blockType.icon.src ? '[React component]' : blockType.icon,
                    };

                    openModal(JSON.stringify(blockTypeForModal, null, 2));
                  }}
                >
                  {__('Dump block type', 'wp-block-debug')}
                </Button>
              </li>

              <li>
                <Button
                  variant="link"
                  onClick={() => openModal(JSON.stringify(blockProps, null, 2))}
                >
                  {createInterpolateElement(
                    sprintf(
                      __('Dump %s', 'wp-block-debug'),
                      '<code>useBlockProps()</code>',
                    ),
                    {
                      code: <code />,
                    },
                  )}
                </Button>
              </li>
            </ul>
          </section>

          <section>
            <h3>{__('Block HTML', 'wp-block-debug')}</h3>

            <pre className="wp-block-debug__markup">
              <Truncate numberOfLines={10}>
                {serializedBlock}
              </Truncate>
            </pre>

            <ul>
              <li>
                <Button
                  variant="link"
                  ref={useCopyToClipboard(
                    serializedBlock,
                    () => createNotice('info', __('Copied block HTML to clipboard.', 'wp-block-debug'), {
                      isDismissible: true,
                      type: 'snackbar',
                    }),
                  )}
                >
                  {__('Copy block HTML', 'wp-block-debug')}
                </Button>
              </li>

              <li>
                <Button
                  variant="link"
                  onClick={() => openModal(serializedBlock)}
                >
                  {__('Dump block HTML', 'wp-block-debug')}
                </Button>
              </li>
            </ul>
          </section>

          <section>
            <h3>{__('Attributes', 'wp-block-debug')}</h3>

            <Form
              className="wp-block-debug__form"
              schema={{
                type: 'object',
                properties: formProperties,
              }}
              formData={getDefaultFormState(validator, formProperties, attributes)}
              onChange={(e) => {
                setAttributes({
                  ...attributes,
                  ...e.formData,
                });
              }}
              omitExtraData
              liveOmit
              validator={validator}
              uiSchema={{
                'ui:submitButtonOptions': {
                  norender: true,
                },
              }}
            />
          </section>
        </PanelBody>
      </InspectorControls>

      {modalOpen ? (
        <Modal
          title={__('Result', 'wp-block-debug')}
          className="wp-block-debug__modal"
          onRequestClose={() => setModalOpen(false)}
        >
          <pre>
            {modalContent}
          </pre>
        </Modal>
      ) : null}
    </>
  );
}

export default Panel;
