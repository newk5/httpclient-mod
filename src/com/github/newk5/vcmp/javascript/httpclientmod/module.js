
"use strict";
module.exports = {
    builder: function () {
        return OkHttpWrapper.requestBuilder();
    },
    client: function (params) {
        if (params == null) {
            params = {};
        }
        let builder = OkHttpWrapper.newClient().newBuilder();
        builder = OkHttpWrapper.setTimeouts(builder, params.connectTimeout, params.writeTimeout, params.readTimeout);
        let client = builder.build();
        return client;
    },
    execute: function (call, async, callback) {
        if (async != null) {
            let isFunc = async && {}.toString.call(async) === '[object Function]';
            if (isFunc) {
                callback = async;
                async = true;
            }
        }
        return OkHttpWrapper.execute(call, async, callback);
    },
    get: function (url, async, callback) {
        if (url != null) {

            if (async != null) {
                let isFunc = async && {}.toString.call(async) === '[object Function]';
                if (isFunc) {
                    callback = async;
                    async = true;
                }
            }

            let request = this.builder().url(url).build();
            let call = this.client().newCall(request);
            return OkHttpWrapper.execute(call, async, callback);
        }

    },
    post: function (params) {
        let asyncc = params.async == null ? false : params.async;
        let onSuccessCallback = params.onSuccess;
        let onErrorCallback = params.onError;
        let type = typeof params.data;
        let body = null;
        let builder = null;
        let headers = params.headers == null ? {} : params.headers;

        if (onSuccessCallback != null) {
            asyncc = true;
        }

        if (params.type == "application/json") {
            body = type == "string" ? OkHttpWrapper.asJsonBody(params.data) : OkHttpWrapper.asJsonBody(JSON.stringify(params.data));
            builder = this.builder().url(params.url).post(body);

            for (var k in headers) {
                builder.addHeader(k + "", headers[k] + "");
            }


        } else if (params.type == "application/x-www-form-urlencoded") {
            let formBuilder = new FormBodyBuilder();
            for (var key in params.data) {
                formBuilder.add(key, params.data[key]);
            }
            body = formBuilder.build();
            builder = this.builder().url(params.url).post(body);
        } else if (params.type == "text/plain") {
            body = OkHttpWrapper.asPlainTextBody(params.data);
            builder = this.builder().url(params.url).post(body);

            for (var k in headers) {
                builder.addHeader(k + "", headers[k] + "");
            }
        }


        let request = builder.build();
        let callObj = this.client({
            connectTimeout: params.connectTimeout,
            writeTimeout: params.writeTimeout,
            readTimeout: params.readTimeout
        }).newCall(request);
        return OkHttpWrapper.exec({ call: callObj, async: asyncc, onSuccess: onSuccessCallback, onError: onErrorCallback });



    },
    postForm: function (url, params, async, callback) {
        if (url != null) {
            let formBuilder = new FormBodyBuilder();

            if (async != null) {
                let isFunc = async && {}.toString.call(async) === '[object Function]';
                if (isFunc) {
                    callback = async;
                    async = true;
                }
            }

            for (var key in params) {
                formBuilder.add(key, params[key]);
            }

            let body = formBuilder.build();
            let request = this.builder().url(url).post(body).build();
            let call = this.client().newCall(request);
            return OkHttpWrapper.execute(call, async, callback);
        }

    },
    postJson: function (url, json, async, callback) {
        if (url != null) {
            let type = typeof json;

            if (async != null) {
                let isFunc = async && {}.toString.call(async) === '[object Function]';
                if (isFunc) {
                    callback = async;
                    async = true;
                }
            }


            let body = type == "string" ? OkHttpWrapper.asJsonBody(json) : OkHttpWrapper.asJsonBody(JSON.stringify(json));
            let request = this.builder().url(url).post(body).build();
            let call = this.client().newCall(request);
            return OkHttpWrapper.execute(call, async, callback);
        }

    },
    jsonBody: function (json) {
        let type = typeof json;

        let body = type == "string" ? OkHttpWrapper.asJsonBody(json) : OkHttpWrapper.asJsonBody(JSON.stringify(json));
        return body;
    }


}