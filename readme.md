# jquery.imoViewer

A lightweight jQuery plugin for image previewing before upload. Allows you to validate image properties (size, width, height, format) before the file is submitted.

## Installation

Include jQuery and the plugin in your HTML:

```html
<script src="dist/jquery.min.js"></script>
<script src="dist/imoViewer-min.js"></script>
```

## Usage

**Basic usage**

```html
<img id="image-preview" src="" alt="Preview" />
<input id="image-input" type="file" />

<script>
  $(function() {
    $('#image-input').imoViewer({
      'preview': '#image-preview'
    });
  });
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `preview` | String | `null` | CSS selector of the `<img>` element to display the preview |
| `minWidth` | Number | `null` | Minimum accepted image width in pixels |
| `minHeight` | Number | `null` | Minimum accepted image height in pixels |
| `maxWidth` | Number | `null` | Maximum accepted image width in pixels |
| `maxHeight` | Number | `null` | Maximum accepted image height in pixels |
| `allowFiles` | String | `'*'` | Comma-separated list of allowed extensions, e.g. `'jpg,png,gif'`, or `'*'` for all |
| `fileSize.min` | Number | `null` | Minimum accepted file size in bytes |
| `fileSize.max` | Number | `null` | Maximum accepted file size in bytes |
| `multiple` | Boolean | `false` | Allow selecting multiple files |
| `onError` | Function | `null` | Callback fired on validation failure. Receives `(errorCode, element, file)` |
| `onSuccess` | Function | `null` | Callback fired after a successful preview. Receives `(element, fileTarget, image)` |
| `onBeforePreview` | Function | `null` | Callback fired just before the preview `src` is set. Receives `(element, fileTarget, image)` |
| `onAfterPreview` | Function | `null` | Callback fired just after the preview `src` is set. Receives `(element, fileTarget, image)` |

## Error Codes

| Code | Constant | Description |
|---|---|---|
| `5001` | `INVALID_FILE_FORMAT` | Selected file extension is not in `allowFiles` |
| `5002` | `INVALID_FILE_SIZE` | File size is outside the `fileSize.min` / `fileSize.max` range |
| `5003` | `INPUT_ERROR` | General input error |
| `5004` | `INVALID_IMAGE_RESOLUTION` | Image dimensions are outside the min/max width/height constraints |

## Example

```html
<img id="image-preview" src="" alt="Preview" />
<input id="image-input" type="file" />
```

```javascript
$(function() {
  $('#image-input').imoViewer({
    'preview'   : '#image-preview',   // preview image element selector
    'minWidth'  : 200,                // minimum width in px
    'minHeight' : 200,                // minimum height in px
    'maxWidth'  : 1920,               // maximum width in px
    'maxHeight' : 1080,               // maximum height in px
    'allowFiles': 'jpg,jpeg,png,gif', // accepted formats
    'fileSize'  : {
      'min': 1024,                    // minimum 1 KB
      'max': 5242880                  // maximum 5 MB
    },
    'onError': function(errorCode, element, file) {
      console.error('Error code: ' + errorCode);
    },
    'onSuccess': function(element, fileTarget, image) {
      console.log('Image preview ready');
    }
  });
});
```

