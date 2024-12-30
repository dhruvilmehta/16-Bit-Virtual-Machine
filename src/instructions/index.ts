import { instructionType, meta } from "./meta";

const indexBy = <K extends keyof instructionType>(
    array: instructionType[],
    prop: K
): Record<instructionType[K], instructionType> =>
    array.reduce((output, item) => {
        output[item[prop]] = item;
        return output;
    }, {} as Record<instructionType[K], instructionType>);

export default indexBy(meta, 'instruction');