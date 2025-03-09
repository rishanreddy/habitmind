import { Document } from "mongoose";

/**
 * Reshapes a set of document to it's object version.
 * Typically used to convert a MongoDB Document from the server side to "use client" components.
 */
export const toObjects = <T extends Document>(
  documents: T[]
): Omit<T, keyof Document>[] =>
  documents.map((document) => document.toObject({ flattenObjectIds: true }));
