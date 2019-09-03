$.fn.imoViewer = function (options) {
  const nameOnly = options.nameOnly || false;
  const maxWidth = options.maxWidth || 1280;
  const maxHeight = options.maxHeight || 800;

  $(this).change(function (e) {
    e.preventDefault();
    const file = $(this)[0].files[0];
    const element = $(this);
    if (nameOnly){
      $(options.preview).html(file.name);
    } else {
      const reader = new FileReader();
      reader.onload = function(file) {
        const image = new Image();
        const content = file.target.result;
        image.src = content;

        image.onload = function (img) {
          const height = this.height;
          const width = this.width;
          if (height <= maxHeight && width <= maxWidth) {
            typeof options.onBeforePreview === 'function' && options.onBeforePreview(file.target,this);
            $(options.preview).attr('src',content);
            typeof options.onAfterPreview === 'function' && options.onAfterPreview(file.target,this);
            typeof options.onSuccess === 'function' && options.onSuccess(element,this);
          } else {
            let comment = `Image size should be less then [${maxWidth}X${maxHeight}]`;
            typeof options.onError === 'function' && options.onError(comment,this);
            $(element).val("");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  })
};