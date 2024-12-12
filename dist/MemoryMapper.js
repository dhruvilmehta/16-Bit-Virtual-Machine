"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryMapper {
    constructor() {
        this.regions = [];
    }
    map(device, start, end, remap = true) {
        const region = {
            device, start, end, remap
        };
        this.regions.unshift(region); // adds at the start and not at the end
        return () => {
            this.regions = this.regions.filter(x => x != region); // when called, removes this particular region from the regions array
        };
    }
    findRegion(address) {
        let region = this.regions.find(r => address >= r.start && address <= r.end);
        if (!region)
            throw new Error(`No memory region found for address ${address}`);
        return region;
    }
    getUint16(address) {
        const region = this.findRegion(address);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.getUint16(finalAddress);
    }
    getUint8(address) {
        const region = this.findRegion(address);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.getUint8(finalAddress);
    }
    setUint16(address, value) {
        const region = this.findRegion(address);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.setUint16(finalAddress, value);
    }
    setUint8(address, value) {
        const region = this.findRegion(address);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.setUint8(finalAddress, value);
    }
}
exports.default = MemoryMapper;
