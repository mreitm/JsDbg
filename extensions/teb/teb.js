"use strict";

var TEB = undefined;
Loader.OnLoad(function() {
    TEB = {
        Tree: new DbgObjectTree.DbgObjectTreeReader(),
        Renderer: new DbgObjectTree.DbgObjectRenderer(),
        InterpretAddress: function(address) {
            return DbgObject.teb()
            .then((teb) => {
                return {
                    toString : () => {
                        return "Thread Environment Block (" + teb.ptr() + ")";
                    },
                    ptr : () => {
                        return teb.ptr();
                    },
                    getChildren : () => {
                        return [{
                            toString : () => {
                                return teb.deref()
                                .then((exceptionList) => {
                                    return "Exception List: " + exceptionList.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(1).deref()
                                .then((stackBase) => {
                                    return "Stack Base: " + stackBase.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(2).deref()
                                .then((stackLimit) => {
                                    return "Stack Limit: " + stackLimit.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(3).deref()
                                .then((subSystemTib) => {
                                    return "SubSystemTib: " + subSystemTib.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(4).deref()
                                .then((fiberData) => {
                                    return "Fiber Data: " + fiberData.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(5).deref()
                                .then((arbitraryDataSlot) => {
                                    return "Arbitrary Data Slot: " + arbitraryDataSlot.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(6).deref()
                                .then((self) => {
                                    return "TEB Address: " + self.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(7).deref()
                                .then((environmentPointer) => {
                                    return "Environment Pointer: " + environmentPointer.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(8).deref()
                                .then((pid) => {
                                    return "Current Process ID: " + parseInt(pid.ptr());
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(9).deref()
                                .then((tid) => {
                                    return "Current Thread ID: " + parseInt(tid.ptr());
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(10).deref()
                                .then((activeRPCHandle) => {
                                    return "Active RPC Handle: " + activeRPCHandle.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(11).deref()
                                .then((tlsArrayPtr) => {
                                    return "Thread-Local Storage (TLS) Array Address: " + tlsArrayPtr.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(12).deref()
                                .then((pebPtr) => {
                                    return "Process Environment Block (PEB) Address: " + pebPtr.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.idx(13).deref()
                                .then((lastErrorNumber) => {
                                    return "Last Error Number: " + lastErrorNumber.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return teb.size()
                                .then((pointerSize) => {
                                    if (pointerSize == 8) {
                                        // 64-bit
                                        return teb.idx(586).deref()
                                    } else {
                                        // 32-bit - TODO
                                        console.log(pointerSize == 4);
                                        return teb.idx(765).deref()
                                    }
                                })
                                .then((lastStatusValue) => {
                                    return "Last Status Value: " + lastStatusValue.ptr();
                                });
                            }
                        },
                        {
                            toString : () => {
                                return "Thread-Local Storage (TLS) Slots: ";
                            },
                            getChildren : () => {
                                return teb.size()
                                .then((pointerSize) => {
                                    if (pointerSize == 8) {
                                        // 64-bit
                                        return teb.idx(656)
                                    } else {
                                        // 32-bit - TODO
                                        console.log(pointerSize == 4);
                                        return teb.idx(900)
                                    }
                                })
                                .then((tlsFirstSlotAddr) => {
                                    var numSlots = 64; // TODO
                                    var tlsSlotValuePromises = [];
                                    for (var i = 0; i < numSlots; i++) {
                                        tlsSlotValuePromises.push(getTlsValue(tlsFirstSlotAddr, i));
                                    }
                                    return Promise.all(tlsSlotValuePromises)
                                    .then((tlsSlotValues) => {
                                        var children = [];
                                        tlsSlotValues.forEach((tlsSlotValue, index) => {
                                            children.push({
                                                toString : () => {
                                                    return "Slot number #" + index + ": " + tlsSlotValue.ptr();
                                                }
                                            });
                                        });
                                        return children;
                                    })
                                })
                            }
                        }]
                    }
                };
            });
        },
        GetRoots: function() {
            return Promise.resolve([]);
        },
        DefaultTypes: []
    };

    function getTlsValue(tlsFirstSlotAddr, slotNumber) {
        return tlsFirstSlotAddr.idx(slotNumber).deref();
    }
});
