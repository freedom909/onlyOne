// src/wisdom/semantic/extractors/patient.extractor.ts
//
// Extracts CUSTOMER_COUNT entities from the message.
// Handles:
//   "2 patients", "3 people", "1 person"
//   "2人" (Japanese)

import { injectable } from "tsyringe";
import { SemanticEntity } from "../semantic.entity";
import { EntityType } from "../../shared/enums/entity-type.enum";
import { ISemanticEntityExtractor } from "./entity-extractor.interface";

@injectable()
export class PatientExtractor implements ISemanticEntityExtractor {
  extract(message: string): SemanticEntity[] {
    // Pattern 1: "N patients/people/person"
    const match = message.match(/(\d+)\s*(patients?|people|person)/i);
    if (match) {
      return [{
        type: EntityType.CUSTOMER_COUNT,
        value: parseInt(match[1], 10),
        confidence: 0.95,
      }];
    }

    // Pattern 2: "N人" (Japanese)
    const japaneseMatch = message.match(/(\d+)人/);
    if (japaneseMatch) {
      return [{
        type: EntityType.CUSTOMER_COUNT,
        value: parseInt(japaneseMatch[1], 10),
        confidence: 0.95,
      }];
    }

    return [];
  }
}
