// Rule 8: 入住人数限制 (Occupancy Limit)
// OccupancyLimitService — ensures patient count doesn't exceed listing capacity
import { OccupancyContext } from "../entity/value-objects/inventory-context.vo";
import { RuleResult, rulePassed, ruleFailed } from "../entity/value-objects/rule-result.vo";

export class OccupancyLimitService {
  static readonly RULE_NAME = "OCCUPANCY_LIMIT";

  /**
   * Validate that the patient count doesn't exceed the listing's max occupancy.
   */
  static evaluate(ctx: OccupancyContext): RuleResult {
    if (ctx.patientCount < 1) {
      return ruleFailed(
        OccupancyLimitService.RULE_NAME,
        "At least 1 patient is required"
      );
    }

    if (ctx.maxOccupancy <= 0) {
      return ruleFailed(
        OccupancyLimitService.RULE_NAME,
        "Listing occupancy limit is not configured"
      );
    }

    if (ctx.patientCount > ctx.maxOccupancy) {
      return ruleFailed(
        OccupancyLimitService.RULE_NAME,
        `patient count (${ctx.patientCount}) exceeds listing capacity (${ctx.maxOccupancy} max patients)`
      );
    }

    return rulePassed(
      OccupancyLimitService.RULE_NAME,
      `${ctx.patientCount} patient(s) within capacity (${ctx.maxOccupancy} max)`
    );
  }
}
