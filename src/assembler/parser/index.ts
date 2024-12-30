import { choice, many } from "arcsecond";
import instructionParser from "./instructions";
import { label } from "./common";

export default many(choice([instructionParser, label]));