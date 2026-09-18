"use strict";

const validateSchema = require("./validateHomeRecord.js");

function validateHomeRecord(data) {
  if (!validateSchema(data)) {
    validateHomeRecord.errors = validateSchema.errors;
    return false;
  }

  for (let index = 0; index < data.attachments.length; index += 1) {
    const attachment = data.attachments[index];
    const pathSegments = attachment.storage_path.split("/");
    const fileName = pathSegments[4];
    const extensionSeparator = fileName.lastIndexOf(".");
    const pathAttachmentID = fileName.slice(0, extensionSeparator);

    if (
      pathSegments[0] !== data.home.owner_user_id ||
      pathSegments[2] !== attachment.home_id ||
      pathAttachmentID !== attachment.id
    ) {
      validateHomeRecord.errors = [{
        instancePath: `/attachments/${index}/storage_path`,
        schemaPath: "#/semantic/canonicalAttachmentPath",
        keyword: "canonicalAttachmentPath",
        params: {
          attachment_id: attachment.id,
          home_id: attachment.home_id,
          owner_user_id: data.home.owner_user_id,
        },
        message: "must match the record owner, attachment home, and attachment id",
      }];
      return false;
    }
  }

  validateHomeRecord.errors = null;
  return true;
}

validateHomeRecord.errors = null;
exports.validateHomeRecord = validateHomeRecord;
