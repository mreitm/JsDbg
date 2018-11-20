"use strict";

var TSFTextStore = undefined;
Loader.OnLoad(function() {
    TSFTextStore = {
        Tree: new DbgObjectTree.DbgObjectTreeReader(),
        Renderer: new DbgObjectTree.DbgObjectRenderer(),
        InterpretAddress: function(address) {
            var voidObj = DbgObject.create("ntdll!void", address);
            if (!voidObj.isNull()) {
                return voidObj.dcast(DbgObjectType("ui_base_ime", "ui::TSFTextStore"))
                .then((tsfTextStore) => {
                    if (!tsfTextStore.isNull()) {
                        return tsfTextStore;
                    } else {
                        return DbgObject.NULL;
                    }
                });
            }
            return DbgObject.NULL;
        },
        GetRoots: function() {
            return DbgObject.globalConstantNames("base", 0)
            //return DbgObject.global("ui_base_ime", "tsf_bridge_tls")
            .then((threadLocalStorageSlot) => {
                debugger;
                return tsfBridgeTls.f("storage_").as(tsfBridgeTls.type.templateParameters()[0] + "*")
                .then((threadLocalStorageSlotPtr) => {
                    return threadLocalStorageSlotPtr.deref()
                    .then((threadLocalStorageSlot) => {
                        return threadLocalStorageSlot.as("ui_base_ime!TSFBridgeImpl*").deref()
                        .then((tsfBridgeImpl) => {
                            debugger;
                        });
                    });
                });
            });
        },
        DefaultTypes: [DbgObjectType("ui_base_ime", "ui::TSFTextStore")]
    };

    // TreeExtensionTemplate.Tree.addChildren(DbgObjectType("ntdll!void"), (voidObj) => {
    //     return [DbgObject.NULL];
    // });

    // TreeExtensionTemplate.Renderer.addNameRenderer(DbgObjectType("ntdll!void"), (voidObj) => {
    //     return "Type name to render";
    // });

    // DbgObject.AddAction(DbgObjectType("ntdll!void"), "TreeExtensionTemplate", (voidObj) => {
    //     return TreeInspector.GetActions("treeExtensionTemplate", "TreeExtensionTemplate", voidObj);
    // });
});