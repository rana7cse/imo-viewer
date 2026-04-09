# imoViewer

A lightweight image previewer for **jQuery**, **React** and **Vue 3**. Validates image properties (size, width, height, format) before the file is submitted.

---

## Installation

```bash
npm install imoviewer
```

---

## jQuery

Include jQuery and the minified build:

```html
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/imoviewer/dist/imoViewer-min.js"></script>
```

**Basic usage**

```html
<img id="image-preview" src="" alt="Preview" />
<input id="image-input" type="file" />

<script>
  $(function() {
    $('#image-input').imoViewer({
      preview: '#image-preview'
    });
  });
</script>
```

---

## React

Import the component from `imoviewer/react`:

```jsx
import ImoViewer, { INVALID_FILE_FORMAT, INVALID_FILE_SIZE, INVALID_IMAGE_RESOLUTION } from 'imoviewer/react';
import { useRef } from 'react';

function App() {
  const previewRef = useRef(null);

  return (
    <>
      <img ref={previewRef} src="" alt="Preview" />
      <ImoViewer
        preview={previewRef}
        allowFiles="jpg,jpeg,png,gif"
        minWidth={200}
        minHeight={200}
        maxWidth={1920}
        maxHeight={1080}
        fileSize={{ min: 1024, max: 5242880 }}
        onError={(code, element, file) => console.error('Error code:', code)}
        onSuccess={(element, fileTarget, image) => console.log('Ready!')}
      />
    </>
  );
}
```

> The `preview` prop accepts a **React ref**, a **CSS selector string**, or a **DOM element**.

---

## Vue 3

Import the component from `imoviewer/vue`:

```vue
<template>
  <img ref="previewRef" src="" alt="Preview" />
  <ImoViewer
    :preview="previewRef"
    allow-files="jpg,jpeg,png,gif"
    :min-width="200"
    :min-height="200"
    :max-width="1920"
    :max-height="1080"
    :file-size="{ min: 1024, max: 5242880 }"
    @error="onError"
    @success="onSuccess"
  />
</template>

<script setup>
import { ref } from 'vue';
import ImoViewer from 'imoviewer/vue';

const previewRef = ref(null);
const onError = (code, element, file) => console.error('Error code:', code);
const onSuccess = (element, fileTarget, image) => console.log('Ready!');
</script>
```

> The `preview` prop accepts a **Vue ref**, a **CSS selector string**, or a **DOM element**.  
> The component also emits `error`, `success`, `before-preview` and `after-preview` events.

---

## Configuration Options

All three flavours share the same options (jQuery: object keys; React/Vue: props):

| Option | Type | Default | Description |
|---|---|---|---|
| `preview` | String / Ref / Element | `null` | Target `<img>` for the preview |
| `minWidth` | Number | `null` | Minimum image width in pixels |
| `minHeight` | Number | `null` | Minimum image height in pixels |
| `maxWidth` | Number | `null` | Maximum image width in pixels |
| `maxHeight` | Number | `null` | Maximum image height in pixels |
| `allowFiles` | String | `'*'` | Comma-separated extensions (`'jpg,png'`) or `'*'` for all |
| `fileSize.min` | Number | `null` | Minimum file size in bytes |
| `fileSize.max` | Number | `null` | Maximum file size in bytes |
| `multiple` | Boolean | `false` | Allow selecting multiple files |
| `onError` | Function | `null` | `(errorCode, element, file) => void` |
| `onSuccess` | Function | `null` | `(element, fileTarget, image) => void` |
| `onBeforePreview` | Function | `null` | `(element, fileTarget, image) => void` |
| `onAfterPreview` | Function | `null` | `(element, fileTarget, image) => void` |

---

## Error Codes

| Code | Constant | Description |
|---|---|---|
| `5001` | `INVALID_FILE_FORMAT` | Extension not in `allowFiles` |
| `5002` | `INVALID_FILE_SIZE` | File size outside `fileSize` range |
| `5003` | `INPUT_ERROR` | General input error |
| `5004` | `INVALID_IMAGE_RESOLUTION` | Dimensions outside min/max constraints |

---

## Building from source

```bash
npm install
npm run build          # builds all three targets
npm run build:jquery   # jQuery only  → dist/imoViewer-min.js
npm run build:react-vue # React + Vue → dist/react/ and dist/vue/
```

