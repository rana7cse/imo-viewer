/*--------------------------------------
 * ImoViewer React Component v1.2
 *--------------------------------------
 *
 *----------------- Author -------------
 * Name     : Salauddin Rana
 * Email    : rana7cse@gmail.com
 * website  : http://www.ranabro.rocks
 *
 * ------------- Licensed ----------------
 * MIT license.
 * ---------------------------------------
 */

import React, { forwardRef } from 'react';
import {
  processFile,
  INVALID_FILE_FORMAT,
  INVALID_FILE_SIZE,
  INVALID_IMAGE_RESOLUTION,
} from '../core.js';

/**
 * ImoViewer – React component that wraps a file <input> and validates /
 * previews images before upload.
 *
 * Props mirror the jQuery plugin options plus standard <input> attributes.
 *
 * @param {string|React.RefObject|HTMLElement} [props.preview]   - Target <img>
 *   selector, ref, or DOM node that will receive the preview src.
 * @param {number}   [props.minWidth]        - Minimum image width in px.
 * @param {number}   [props.minHeight]       - Minimum image height in px.
 * @param {number}   [props.maxWidth]        - Maximum image width in px.
 * @param {number}   [props.maxHeight]       - Maximum image height in px.
 * @param {string}   [props.allowFiles='*']  - Comma-separated extensions or '*'.
 * @param {{min?,max?}} [props.fileSize]     - File size limits in bytes.
 * @param {boolean}  [props.multiple=false]  - Allow multiple file selection.
 * @param {Function} [props.onError]         - (errorCode, element, file) => void
 * @param {Function} [props.onSuccess]       - (element, fileTarget, image) => void
 * @param {Function} [props.onBeforePreview] - (element, fileTarget, image) => void
 * @param {Function} [props.onAfterPreview]  - (element, fileTarget, image) => void
 */
const ImoViewer = forwardRef(function ImoViewer(
  {
    preview = null,
    minHeight = null,
    minWidth = null,
    maxHeight = null,
    maxWidth = null,
    allowFiles = '*',
    fileSize = { max: null, min: null },
    multiple = false,
    onError = null,
    onSuccess = null,
    onBeforePreview = null,
    onAfterPreview = null,
    ...rest
  },
  ref
) {
  const resolvePreviewElement = (previewProp) => {
    if (!previewProp) return null;
    if (typeof previewProp === 'string') return document.querySelector(previewProp);
    if (previewProp && typeof previewProp === 'object' && 'current' in previewProp) {
      return previewProp.current;
    }
    if (previewProp instanceof Element) return previewProp;
    return null;
  };

  const handleChange = async (e) => {
    const files = e.target.files;
    const element = e.target;

    if (!files || files.length === 0) return;

    const config = { minHeight, minWidth, maxHeight, maxWidth, allowFiles, fileSize };

    for (let i = 0; i < files.length; i++) {
      try {
        const { content, fileTarget, image } = await processFile(files[i], config);

        if (typeof onBeforePreview === 'function') onBeforePreview(element, fileTarget, image);

        const previewEl = resolvePreviewElement(preview);
        if (previewEl) previewEl.src = content;

        if (typeof onAfterPreview === 'function') onAfterPreview(element, fileTarget, image);
        if (typeof onSuccess === 'function') onSuccess(element, fileTarget, image);
      } catch (err) {
        if (typeof onError === 'function') {
          onError(err.code, element, err.file || err.image || null);
        }
      }
    }
  };

  return (
    <input
      ref={ref}
      type="file"
      multiple={multiple}
      onChange={handleChange}
      {...rest}
    />
  );
});

export default ImoViewer;
export { INVALID_FILE_FORMAT, INVALID_FILE_SIZE, INVALID_IMAGE_RESOLUTION };
