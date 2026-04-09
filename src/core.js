/*--------------------------------------
 * imoViewer Core v1.2
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

export const INVALID_FILE_FORMAT = 5001;
export const INVALID_FILE_SIZE = 5002;
export const INPUT_ERROR = 5003;
export const INVALID_IMAGE_RESOLUTION = 5004;

export const blank = (val) => {
  return typeof val === 'undefined' || val === null || val === 0 || val === '' || val.length === 0;
};

export const isValidExtension = (file, supportedExtensions) => {
  const extension = ((file instanceof File ? (file.name || '') : file).split('.').pop()) || null;
  return (supportedExtensions === '*') || (extension !== null && supportedExtensions.indexOf(extension) >= 0);
};

export const isValidSize = (file, optionFileSize) => {
  if (!(file instanceof File)) return false;
  if (blank(optionFileSize)) return true;
  if (typeof optionFileSize !== 'object') return false;
  if (!blank(optionFileSize.min) && file.size < optionFileSize.min) return false;
  if (!blank(optionFileSize.max) && file.size > optionFileSize.max) return false;
  return true;
};

/**
 * Process a single file: validate size, extension and image resolution.
 * Returns a Promise that resolves with { content, fileTarget, image }
 * or rejects with { code, file?, image? }.
 */
export const processFile = (file, config) => {
  return new Promise((resolve, reject) => {
    if (!isValidSize(file, config.fileSize)) {
      reject({ code: INVALID_FILE_SIZE, file });
      return;
    }

    if (!isValidExtension(file, config.allowFiles)) {
      reject({ code: INVALID_FILE_FORMAT, file });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      const content = e.target.result;
      image.src = content;

      image.onload = () => {
        const height = image.height;
        const width = image.width;
        if (
          (config.maxWidth != null && width > config.maxWidth) ||
          (config.maxHeight != null && height > config.maxHeight) ||
          (config.minWidth != null && width < config.minWidth) ||
          (config.minHeight != null && height < config.minHeight)
        ) {
          reject({ code: INVALID_IMAGE_RESOLUTION, image });
        } else {
          resolve({ content, fileTarget: e.target, image });
        }
      };
    };
    reader.readAsDataURL(file);
  });
};
