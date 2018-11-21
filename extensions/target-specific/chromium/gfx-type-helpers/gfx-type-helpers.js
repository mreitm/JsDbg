Loader.OnLoad(function() {
    DbgObject.AddTypeDescription(
        Chromium.RendererProcessType("gfx::Size"),
        "Size",
        true,
        UserEditableFunctions.Create((size) => Promise.all([size.f("width_").val(), size.f("height_").val()])
            .thenAll((first, second) => `{${first}, ${second}}`))
    );

    DbgObject.AddTypeDescription(
        Chromium.RendererProcessType("gfx::Point"),
        "Point",
        true,
        UserEditableFunctions.Create((point) => Promise.all([point.f("x_").val(), point.f("y_").val()])
            .thenAll((first, second) => `{${first}, ${second}}`))
    );

    DbgObject.AddTypeDescription(
        DbgObjectType("ui_base_ime", "gfx::Range"),
        "Range",
        true,
        UserEditableFunctions.Create((range) => Promise.all([range.f("start_").val(), range.f("end_").val()])
            .thenAll((start, end) => `{${start}, ${end}}`))
    );
})
