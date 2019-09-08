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
  const INVALID_FILE_FORMAT = 1;
  const INVALID_FILE_SIZE = 2;
  const INPUT_ERROR = 3;
  const INVALID_IMAGE_RESULATION = 4;

  const fireEvent = (fn,...params) => {
    return (typeof fn === 'function') && fn(...params);
  };

  $.fn.imoViewer = function (options) {
    const baseElems = $(this);

    const config = $.extend({}, {
      'image' : {
        'minHeight' : null,
        'minWidth'  : null,
        'maxHeight' : null,
        'maxWidth'  : null
      },
      'allowFiles' : '*',
      'maxSize' : '*', // Kilobyte
      'multiple' : false
    }, options);

    let isValidExtension = (file, supportedExtensions) => {
      let extension = ((file instanceof File ? ( file.name || '' ) : file).split('.').pop()) || null;
      return (supportedExtensions === '*') || (extension !== null && supportedExtensions.indexOf(extension) >= 0);
    };

    let isValidSize = (file, maxSize) => file instanceof File ? (file.size / 1024) <= maxSize : false;

    let runFileViewer = (file, elem) => {

      if (!isValidSize(file,config.maxSize))  {
        fireEvent(config.onError,INVALID_FILE_SIZE,elem,file);
        throw Error("Invalid file size");
      }

      if (!isValidExtension(file,config.allowFiles))  {
        fireEvent(config.onError,INVALID_FILE_FORMAT,elem,file);
        throw Error("Invalid file format");
      }

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
    };

    $(this).change(function (e) {
      e.preventDefault();
      let file = $(this)[0].files;
      let element = $(this);
      console.log(file);
    })
  };

})($,window,document);