import * as createError from "http-errors";


(async () => {
    const error1 = new createError.HttpError("afdfer")
    console.log(error1)
})()
