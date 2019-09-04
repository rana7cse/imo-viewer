#jquery.imoViewer

A lightweight jQuery plugin for image previewer when you change a image through file input before uploading. That's also help you to validate image property (e.g size,width,height).

Usage
-
**Initialization & Settings**

Basic usage with setup on single html file
```html
<script src="dist/jquery.min.js"></script>
<script src="dist/imoViewer-min.js"></script>
<script>
  $(function() {
    $('fileelement').imoViewer({
      'preview' : 'preview-image-element'
    });
  })
</script>
```
###example
Html markup
```html
<image id="image-previe" src="placeholder"/>
<input id="image-input" type="file" />
```
JavaScript

```javascript
$(function() {
    $('#image-input').imoViewer({
      'preview' : '#image-previe', // preview image element id
      'minWidth' : 200, // accepted min width
      'minHeight' : 200, // accepted min height
      'onError' : function(message,file) { // error callback
        // your code gose here
      },
      'onSuccess' : function(element,file) { // after pass validation successfully show image callback
        // your code gose here
      }
    });
})
```

