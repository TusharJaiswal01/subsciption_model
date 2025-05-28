import type { Request, Response } from "express";
import { Plan } from "../models/Plan";

export class PlanController {
  static async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await Plan.find().select("-__v");
      res.json({
        success: true,
        data: plans,
        count: plans.length,
      });
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch plans",
      });
    }
  }

  static async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, price, features, duration } = req.body;

      if (!id || !name || !price || !features || !duration) {
        res.status(400).json({
          success: false,
          error: "All fields are required: id, name, price, features, duration",
        });
        return;
      }

      const plan = new Plan({
        id,
        name,
        price,
        features: Array.isArray(features) ? features : [features],
        duration,
      });

      await plan.save();

      res.status(201).json({
        success: true,
        data: plan,
        message: "Plan created successfully",
      });
    } catch (error: any) {
      console.error("Error creating plan:", error);

      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          error: "Plan with this ID already exists",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to create plan",
      });
    }
  }
}
