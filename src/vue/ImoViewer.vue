<!--
  ImoViewer Vue 3 Component v1.2
  ================================
  Author  : Salauddin Rana
  Email   : rana7cse@gmail.com
  Website : http://www.ranabro.rocks
  License : MIT
-->

<template>
  <input
    type="file"
    v-bind="$attrs"
    :multiple="multiple"
    @change="handleChange"
  />
</template>

<script>
import { defineComponent } from 'vue';
import {
  processFile,
  INVALID_FILE_FORMAT,
  INVALID_FILE_SIZE,
  INVALID_IMAGE_RESOLUTION,
} from '../core.js';

export { INVALID_FILE_FORMAT, INVALID_FILE_SIZE, INVALID_IMAGE_RESOLUTION };

/**
 * ImoViewer – Vue 3 component that wraps a file <input> and validates /
 * previews images before upload.
 *
 * Props mirror the jQuery plugin options plus any native <input> attributes
 * (passed through via $attrs / inheritAttrs: false).
 */
export default defineComponent({
  name: 'ImoViewer',

  inheritAttrs: false,

  props: {
    /** Target <img> CSS selector, Vue ref object, or DOM element for the preview. */
    preview: {
      type: [String, Object],
      default: null,
    },
    minWidth:  { type: Number, default: null },
    minHeight: { type: Number, default: null },
    maxWidth:  { type: Number, default: null },
    maxHeight: { type: Number, default: null },
    /** Comma-separated file extensions, e.g. 'jpg,png', or '*' for all. */
    allowFiles: { type: String, default: '*' },
    /** { min?: number, max?: number } – file size limits in bytes. */
    fileSize: {
      type: Object,
      default: () => ({ max: null, min: null }),
    },
    multiple: { type: Boolean, default: false },

    onError:         { type: Function, default: null },
    onSuccess:       { type: Function, default: null },
    onBeforePreview: { type: Function, default: null },
    onAfterPreview:  { type: Function, default: null },
  },

  emits: ['error', 'success', 'before-preview', 'after-preview'],

  setup(props, { emit }) {
    const resolvePreviewElement = (previewProp) => {
      if (!previewProp) return null;
      if (typeof previewProp === 'string') return document.querySelector(previewProp);
      // Vue ref: { value: HTMLElement }
      if (previewProp && typeof previewProp === 'object' && 'value' in previewProp) {
        return previewProp.value instanceof Element ? previewProp.value : null;
      }
      if (previewProp instanceof Element) return previewProp;
      return null;
    };

    const handleChange = async (e) => {
      const files = e.target.files;
      const element = e.target;

      if (!files || files.length === 0) return;

      const config = {
        minHeight: props.minHeight,
        minWidth:  props.minWidth,
        maxHeight: props.maxHeight,
        maxWidth:  props.maxWidth,
        allowFiles: props.allowFiles,
        fileSize:   props.fileSize,
      };

      for (let i = 0; i < files.length; i++) {
        try {
          const { content, fileTarget, image } = await processFile(files[i], config);

          if (typeof props.onBeforePreview === 'function') props.onBeforePreview(element, fileTarget, image);
          emit('before-preview', element, fileTarget, image);

          const previewEl = resolvePreviewElement(props.preview);
          if (previewEl) previewEl.src = content;

          if (typeof props.onAfterPreview === 'function') props.onAfterPreview(element, fileTarget, image);
          emit('after-preview', element, fileTarget, image);

          if (typeof props.onSuccess === 'function') props.onSuccess(element, fileTarget, image);
          emit('success', element, fileTarget, image);
        } catch (err) {
          const errArg = err.file || err.image || null;
          if (typeof props.onError === 'function') props.onError(err.code, element, errArg);
          emit('error', err.code, element, errArg);
        }
      }
    };

    return { handleChange };
  },
});
</script>
