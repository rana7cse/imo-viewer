/*--------------------------------------
 * jQuery.imoViewer jQuery Plugin v1.1
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
  const INVALID_FILE_FORMAT = 5001;
  const INVALID_FILE_SIZE = 5002;
  const INPUT_ERROR = 5003;
  const INVALID_IMAGE_RESOLUTION = 5004;

  let defaultConfigurations = {
    'preview'        : null,
    'minHeight'      : null,
    'minWidth'       : null,
    'maxHeight'      : null,
    'maxWidth'       : null,
    'allowFiles'     : '*',
    'fileSize'       : {
      max : null,
      min : null,
    },
    'multiple'       : false,
    'onError'        : null,
    'onSuccess'      : null,
    'onBeforePreview': null,
    'onAfterPreview' : null
  };

  const blank = (val) => {
    return typeof val == 'undefined' || val === null || val === 0 || val === '' || val.length === 0;
  };

  const fireEvent = (fn,...params) => {
    return (typeof fn === 'function') && fn(...params);
  };

  let isValidExtension = (file, supportedExtensions) => {
    let extension = ((file instanceof File ? ( file.name || '' ) : file).split('.').pop()) || null;
    return (supportedExtensions === '*') || (extension !== null && supportedExtensions.indexOf(extension) >= 0);
  };

  let isValidSize = (file, optionFileSize) => {
    if (!(file instanceof File)) {
      return false;
    }

    if (blank(optionFileSize)) {
      return true;
    }

    if (typeof optionFileSize !== 'object') {
      return false;
    }

    if (!blank(optionFileSize.min) && file.size < optionFileSize.min) {
      return false;
    }

    if (!blank(optionFileSize.max) && file.size > optionFileSize.max) {
      return false;
    }

    return true;
  };



  $.fn.imoViewer = function (options) {
    const baseElems = $(this);

    const config = $.extend({}, defaultConfigurations , options);


    let runFileViewer = (file, elem) => {

      if (!isValidSize(file,config.fileSize))  {
        fireEvent(config.onError,INVALID_FILE_SIZE,elem,file);
        return;
      }

      if (!isValidExtension(file,config.allowFiles))  {
        fireEvent(config.onError,INVALID_FILE_FORMAT,elem,file);
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const image = new Image();
        const content = e.target.result;
        image.src = content;

        image.onload = function () {
          const height = this.height;
          const width = this.width;
          if ((config.maxWidth != null && width > config.maxWidth) ||
              (config.maxHeight != null && height > config.maxHeight) ||
              (config.minWidth != null && width < config.minWidth) ||
              (config.minHeight != null && height < config.minHeight)) {
            fireEvent(config.onError, INVALID_IMAGE_RESOLUTION, elem, this);
          } else {
            fireEvent(config.onBeforePreview, elem, e.target, this);
            $(config.preview).attr('src', content);
            fireEvent(config.onAfterPreview, elem, e.target, this);
            fireEvent(config.onSuccess, elem, e.target, this);
          }
        };
      };
      reader.readAsDataURL(file);
    };

    $(this).change(function (e) {
      e.preventDefault();
      let files = $(this)[0].files;
      let element = $(this);
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          runFileViewer(files[i], element);
        }
      }
    });
  };

})($,window,document);