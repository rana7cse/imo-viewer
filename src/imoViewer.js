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
  const INVALID_FILE_FORMAT = 5001;
  const INVALID_FILE_SIZE = 5002;
  const INPUT_ERROR = 5003;
  const INVALID_IMAGE_RESULATION = 5004;

  let defaultConfigurations = {
    'image' : {
      'minHeight' : null,
      'minWidth'  : null,
      'maxHeight' : null,
      'maxWidth'  : null
    },
    'allowFiles' : '*',
    'fileSize' : {
      max : null,
      min : null,
    },
    'multiple' : false
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
    if (!file instanceof File) {
      throw new Error("File object expected");
    }

    if (blank(optionFileSize)) {
      return true;
    }

    if (typeof optionFileSize !== 'object') {
      throw new Error("fileSize option should be an object");
    }

    if (!blank(optionFileSize.min) && file.length < optionFileSize.min) {
      throw new Error("File size should be bigger then min file size");
    }

    if (!blank(optionFileSize.max) && file.length > optionFileSize.max) {
      throw new Error("File size should be less then max file size");
    }

    return true;
  };



  $.fn.imoViewer = function (options) {
    const baseElems = $(this);

    const config = $.extend({}, defaultConfigurations , options);


    let runFileViewer = (file, elem) => {

      if (!isValidSize(file,config.fileSize))  {
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
    })
  };

})($,window,document);