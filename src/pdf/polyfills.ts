// react-pdf reads embedded fonts/images through Node's Buffer, which browsers don't have.
// Imported first by ./generate.ts so it runs before the PDF engine is evaluated.
import { Buffer } from "buffer";

const g = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
if (!g.Buffer) g.Buffer = Buffer;
