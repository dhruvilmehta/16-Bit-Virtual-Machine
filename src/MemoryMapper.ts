class MemoryMapper {
    private regions: Array<Region>;

    constructor() {
        this.regions = [];
    }

    public map(device: ScreenDevice | DataView, start: number, end: number, remap: boolean = true) {
        const region = {
            device, start, end, remap
        }

        this.regions.unshift(region) // adds at the start and not at the end

        return () => {
            this.regions = this.regions.filter(x => x != region) // when called, removes this particular region from the regions array
        }
    }

    public findRegion(address: number): Region {
        let region = this.regions.find(r => address >= r.start && address <= r.end)
        if (!region) throw new Error(`No memory region found for address ${address}`)

        return region
    }

    public getUint16(address: number) {
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.start : address
        return region.device.getUint16(finalAddress)
    }

    public getUint8(address: number) {
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.getUint8(finalAddress)
    }

    public setUint16(address: number, value: number) {
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.start : address;

        return region.device.setUint16(finalAddress, value)
    }

    public setUint8(address: number, value: number) {
        const region = this.findRegion(address)
        const finalAddress = region.remap ? address - region.start : address;

        return region.device.setUint8(finalAddress, value)
    }
}

export default MemoryMapper;

export type ScreenDevice = {
    getUint16: (address: number) => number;
    getUint8: (address: number) => number;
    setUint16: (address: number, data: number) => void;
    setUint8: (address: number, data: number) => void;
}
type Region = {
    device: ScreenDevice,
    start: number,
    end: number,
    remap: boolean
}