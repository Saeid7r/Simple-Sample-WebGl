function getContext() {
    var canvas = window.document.querySelector("#lol");
    var webGL_context;
    if (canvas instanceof HTMLCanvasElement) {
        webGL_context = canvas.getContext("webgl");
    }
    if (!webGL_context) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    return webGL_context;
}
function compileShader(webGL_context, shaderSource, shaderType) {
    var Shader = webGL_context.createShader(shaderType);
    webGL_context.shaderSource(Shader, shaderSource);
    webGL_context.compileShader(Shader);
    var success = webGL_context.getShaderParameter(Shader, webGL_context.COMPILE_STATUS);
    if (!success) {
        alert("shader failed to compile" + shaderType);
    }
    return Shader;
}
function CompileAndLinkProgram(webGL_context, VertexShader, FragmentShader) {
    var webGL_program = webGL_context.createProgram();
    webGL_context.attachShader(webGL_program, VertexShader);
    webGL_context.attachShader(webGL_program, FragmentShader);
    webGL_context.linkProgram(webGL_program);
    return webGL_program;
}
function main() {
    var webGL_context = getContext();
    var VertexShaderSource = document.querySelector("#vertex").textContent;
    var FragmentShaderSource = document.querySelector("#fragment").textContent;
    var VertexShader = compileShader(webGL_context, VertexShaderSource, webGL_context.VERTEX_SHADER);
    var FragmentShader = compileShader(webGL_context, FragmentShaderSource, webGL_context.FRAGMENT_SHADER);
    var success = "vs: " + webGL_context.getShaderParameter(VertexShader, webGL_context.COMPILE_STATUS);
    success += "  fs: " + webGL_context.getShaderParameter(FragmentShader, webGL_context.COMPILE_STATUS);
    alert(success);
    var webGL_program = CompileAndLinkProgram(webGL_context, VertexShader, FragmentShader);
    success += "  link: " + webGL_context.getProgramParameter(webGL_program, webGL_context.LINK_STATUS);
    var positionAttributeLocation = webGL_context.getAttribLocation(webGL_program, "a_position");
    var verts = [
        0, 0,
        1, 0,
        0, 0.5,
        0, 1,
        0, 0,
        0.5, 0
    ];
    var buffer = webGL_context.createBuffer();
    webGL_context.bindBuffer(webGL_context.ARRAY_BUFFER, buffer); //mounting buffer on ArrayBuffer point
    webGL_context.bufferData(webGL_context.ARRAY_BUFFER, new Float32Array(verts), webGL_context.STATIC_DRAW);
    /**BS! changing
     mounted buffers data is possible and not unbounded*/
    webGL_context.viewport(0, 0, webGL_context.canvas.width, webGL_context.canvas.height); //in order to match the canvas with the cliping space
    webGL_context.clearColor(0.0, 0.0, 0.0, 1.0);
    webGL_context.clear(webGL_context.COLOR_BUFFER_BIT);
    webGL_context.useProgram(webGL_program);
    webGL_context.enableVertexAttribArray(positionAttributeLocation);
    webGL_context.bindBuffer(webGL_context.ARRAY_BUFFER, buffer);
    /**BS! buffer can bound several times using a buffer wont
     unbind it*/
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = webGL_context.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    webGL_context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    var primitiveType = webGL_context.TRIANGLES;
    offset = 0;
    var count = 6;
    webGL_context.drawArrays(primitiveType, offset, count);
}
main();
//alert(success);
//# sourceMappingURL=test.js.map