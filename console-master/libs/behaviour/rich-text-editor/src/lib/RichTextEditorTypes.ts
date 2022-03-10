export enum StartStateType {
  HTML = 'html',
  DELTA_JSON = 'deltaJson',
}

export enum ErrorType {
  // happens when uploaded file is not an image
  UploadedFileUnrecognizedImage,
  // happens when the upload file is exceeded.  The details will be the value max file size in MB
  UploadedFileSizeExceeded,
}
