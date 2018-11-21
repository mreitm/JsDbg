"use strict";

var TEB = undefined;
Loader.OnLoad(function() {
    TEB = {
        Tree: new DbgObjectTree.DbgObjectTreeReader(),
        Renderer: new DbgObjectTree.DbgObjectRenderer(),
        InterpretAddress: function(address) {
            return DbgObject.create(DbgObjectType("ntdll", "_TEB"), address);
        },
        GetRoots: function() {
            return Promise.all([DbgObject.teb()]);
        },
        DefaultTypes: [DbgObjectType("ntdll", "_TEB")]
    };

    DbgObject.AddTypeDescription(DbgObjectType("ntdll", "_TEB"), "Process ID", false, UserEditableFunctions.Create((teb) => {
        return teb.f("ClientId").f("UniqueProcess").val()
        .then((pid) => parseInt(pid));
    }));

    DbgObject.AddTypeDescription(DbgObjectType("ntdll", "_TEB"), "Thread ID", false, UserEditableFunctions.Create((teb) => {
        return teb.f("ClientId").f("UniqueThread").val()
        .then((tid) => parseInt(tid));
    }));

    DbgObject.AddArrayField(DbgObjectType("ntdll", "_TEB"), "TLS Slots", DbgObjectType("ntdll", "void*"), UserEditableFunctions.Create((teb) => {
        var tlsMinimumAvailableSlots = 64;
        var tlsMaximumAvailableSlots = 1088;
        return Promise.all([teb.f("TlsSlots"), teb.f("TlsExpansionSlots")])
        .thenAll((tlsSlots, tlsExpansionSlots) => {
            if (tlsExpansionSlots.isNull()) {
                return tlsSlots.array(tlsMinimumAvailableSlots);
            } else {
                return Promise.all([tlsSlots.array(tlsMinimumAvailableSlots), tlsExpansionSlots.array(tlsMaximumAvailableSlots - tlsMinimumAvailableSlots)])
                .thenAll((tlsSlotArray, tlsExpansionSlotArray) => {
                    return tlsSlotArray.concat(tlsExpansionSlotArray);
                });
            }
        });
    }));
});
