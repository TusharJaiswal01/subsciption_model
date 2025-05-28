import type { Request, Response } from "express";
import { Subscription } from "../models/Subscription";
import { Plan } from "../models/Plan";
import { SubscriptionStatus } from "../types";

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export class SubscriptionController {
  
  static async createSubscription(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { planId } = req.body;
      const userId = req.user?.id;

      if (!planId) {
        res.status(400).json({
          success: false,
          error: "Plan ID is required",
        });
        return;
      }

      
      const plan = await Plan.findOne({ id: planId });
      if (!plan) {
        res.status(404).json({
          success: false,
          error: "Plan not found",
        });
        return;
      }

     
      const existingSubscription = await Subscription.findOne({
        userId,
        status: { $in: [SubscriptionStatus.ACTIVE] },
      });

      if (existingSubscription) {
        res.status(400).json({
          success: false,
          error: "User already has an active subscription",
        });
        return;
      }

     
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.duration);

      const subscription = new Subscription({
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
      });

      await subscription.save();

      res.status(201).json({
        success: true,
        data: subscription,
        message: "Subscription created successfully",
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create subscription",
      });
    }
  }

  
  static async getUserSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const subscription = await Subscription.findOne({ userId }).select(
        "-__v"
      );

      if (!subscription) {
        res.status(404).json({
          success: false,
          error: "No subscription found for this user",
        });
        return;
      }

     
      const plan = await Plan.findOne({ id: subscription.planId }).select(
        "-__v"
      );

      res.json({
        success: true,
        data: {
          subscription,
          plan,
        },
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch subscription",
      });
    }
  }

  static async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { planId } = req.body;

      if (!planId) {
        res.status(400).json({
          success: false,
          error: "Plan ID is required",
        });
        return;
      }

      
      const newPlan = await Plan.findOne({ id: planId });
      if (!newPlan) {
        res.status(404).json({
          success: false,
          error: "Plan not found",
        });
        return;
      }

     
      const subscription = await Subscription.findOne({ userId });
      if (!subscription) {
        res.status(404).json({
          success: false,
          error: "No subscription found for this user",
        });
        return;
      }

     
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + newPlan.duration);

      subscription.planId = planId;
      subscription.endDate = newEndDate;
      subscription.updatedAt = new Date();

      await subscription.save();

      res.json({
        success: true,
        data: subscription,
        message: "Subscription updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update subscription",
      });
    }
  }

    static async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const subscription = await Subscription.findOne({ userId });

      if (!subscription) {
        res.status(404).json({
          success: false,
          error: "No subscription found for this user",
        });
        return;
      }

      
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.updatedAt = new Date();

      await subscription.save();

      res.json({
        success: true,
        data: subscription,
        message: "Subscription cancelled successfully",
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({
        success: false,
        error: "Failed to cancel subscription",
      });
    }
  }

 
  static async expireSubscriptions(): Promise<void> {
    try {
      const now = new Date();

      await Subscription.updateMany(
        {
          status: SubscriptionStatus.ACTIVE,
          endDate: { $lt: now },
        },
        {
          status: SubscriptionStatus.EXPIRED,
          updatedAt: now,
        }
      );

      console.log("✅ Expired subscriptions updated");
    } catch (error) {
      console.error("❌ Error expiring subscriptions:", error);
    }
  }
}
