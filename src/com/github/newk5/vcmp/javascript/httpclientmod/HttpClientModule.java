package com.github.newk5.vcmp.javascript.httpclientmod;

import com.eclipsesource.v8.V8;
import com.github.newk5.vcmp.javascript.httpclientmod.injectables.OkHttpWrapper;
import com.github.newk5.vcmp.javascript.plugin.module.Module;
import io.alicorn.v8.V8JavaAdapter;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.stream.Collectors;
import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.pf4j.Extension;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

public class HttpClientModule extends Plugin {

    public static ThreadPoolExecutor pool;
    private static V8 v8 = com.github.newk5.vcmp.javascript.plugin.internals.Runtime.v8;

    public HttpClientModule(PluginWrapper wrapper) {
        super(wrapper);
        this.pool = (ThreadPoolExecutor) Executors.newCachedThreadPool();
    }

    @Extension
    public static class HttpClient implements Module {

        @Override
        public void inject() {
            V8JavaAdapter.injectClass(OkHttpClient.class, v8);
            V8JavaAdapter.injectClass("HttpRequest", Request.class, v8);
            V8JavaAdapter.injectClass("RequestBuilder", Request.Builder.class, v8);
            V8JavaAdapter.injectClass("HttpResponse", Response.class, v8);
            V8JavaAdapter.injectClass("HttpCall", Call.class, v8);
            V8JavaAdapter.injectClass("RequestBody", RequestBody.class, v8);
            V8JavaAdapter.injectClass("MediaType", MediaType.class, v8);
            V8JavaAdapter.injectClass("FormBodyBuilder", FormBody.Builder.class, v8);
            V8JavaAdapter.injectClass("MultipartBodyBuilder", MultipartBody.Builder.class, v8);
            V8JavaAdapter.injectObject("OkHttpWrapper", new OkHttpWrapper(), v8);

        }

        @Override
        public String javascript() {
            InputStream in = HttpClientModule.class.getResourceAsStream("module.js");
            BufferedReader reader = new BufferedReader(new InputStreamReader(in));
            String code = reader.lines().collect(Collectors.joining("\n"));

            return code;
        }

    }
}
