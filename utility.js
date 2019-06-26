// util function:
export function convertToInt(value, base = 10) {
    return parseInt(value, base)
}

export function sendErrorCode(responseHandler, errorMessage, code=400) {
    return responseHandler.status(code).send({
        success: false,
        message: errorMessage
    })
}

export function checkTitle(responseHandler, title) {
    const errorMessage = 'Please specify title!'
    if (!title) {
        sendErrorCode(responseHandler, errorMessage)
    }
}

export function checkDescription(responseHandler, description) {
    const errorMessage = 'Please specify description!'
    if (!description) {
        sendErrorCode(responseHandler, errorMessage)
    }
}

// end of util function