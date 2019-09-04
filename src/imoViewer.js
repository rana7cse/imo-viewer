/*--------------------------------------
 * jQuery.imoViewer jQuery Plugin v1.0
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
;

(function ($,window,document,undefined) {
  /*
  * Error codes
  * */
  const IMAGE_SIZE_NOT_MATCH = 400;
  const TOO_LARGE_FILE = 500;

  const fireEvent = (fn,...params) => {
    return (typeof fn === 'function') && fn(...params);
  };

  $.fn.imoViewer = function (options) {
    const nameOnly = options.nameOnly || false;
    const maxWidth = options.maxWidth || null;
    const maxHeight = options.maxHeight || null;

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
            if (( maxWidth != null && height > maxHeight) || (maxHeight != null && width > maxWidth)) {
              fireEvent(options.onError,IMAGE_SIZE_NOT_MATCH,element,this);
              $(element).val("");
            } else {
              fireEvent(options.onBeforePreview,element,file.target,this);
              $(options.preview).attr('src',content);
              fireEvent(options.onAfterPreview,element,file.target,this);
              fireEvent(options.onSuccess,element,file.target,this);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    })
  };
})($,window,document);