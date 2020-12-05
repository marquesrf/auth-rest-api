// packages import
import { find } from "lodash";

import Messages from "./Messages";

// check if key exists
const isKeyExists = (key) => {
  return Messages.KEYS && key ? key in Messages.KEYS : false;
};

// get message object by key
const messageObjectByKey = (key) => {
  const language = process.env.DEFAULT_LANGUAGE;
  if (key) {
    const message = find({
      key: key,
      language: language,
    });
    return message;
  }
  return null;
};

// get message by key
const messageByKey = (key) => {
  if (isKeyExists(key)) {
    const { value } = messageObjectByKey(key);
    return value ? value : "";
  }
  return "";
};

// get status by key
const statusByKey = (key) => {
  if (isKeyExists(key)) {
    const { status } = messageObjectByKey(key);
    return status ? status : "";
  }
  return 500;
};

const MessageProvider = {
  messageByKey,
  statusByKey,
};

export default MessageProvider;
