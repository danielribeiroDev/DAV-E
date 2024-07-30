import { EventEmitter } from "node:events"

import {
    writeFile
  } from "node:fs/promises"

const prepareDataMockFile = async (data, filePath) => {
    return writeFile(
        filePath, JSON.stringify(data)
    )
}

const createMockRequest = (method, url, body) => {
    const request = new EventEmitter();
  
    request.method = method || 'GET';
    request.url = url || '/';
    request.headers = {};
    request.body = body || null;
  
    if (body) {
      process.nextTick(() => {
        request.emit('data', JSON.stringify(body));
        request.emit('end');
      });
    }
    return request;
  }


export {
    prepareDataMockFile,
    createMockRequest
}