function CreateMemory(sizeInBytes: number): DataView {
    const ab = new ArrayBuffer(sizeInBytes);
    const dv = new DataView(ab);
    return dv;
}

export default CreateMemory;