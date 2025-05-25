import { Response, Request } from "express";
import { PlanBody } from "../../types/plan";
import { AuthenticatedRequest } from "../../types/express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ClientData = {
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
};

//storeDietPlan
export async function storeDietPlan(
  req: AuthenticatedRequest & PlanBody,
  res: Response
) {
  try {
    const userId = req.user.userId;
    const { clientData, chatGPTAnswer } = req.body;

    const validClientData = clientData as ClientData;

    console.log("storeDietPlan, clientData: ", validClientData);

    const storedPlan = await prisma.plan.create({
      data: {
        type: "DIET",
        clientFirstName: clientData.clientFirstName,
        clientLastName: clientData.clientLastName,
        clientEmail: clientData.clientEmail,
        dietPlan: chatGPTAnswer,
        userId: userId,
      },
    });

    res.status(201).json({ storedPlan });
    return;
  } catch (error) {
    console.log("generateDietPlan error", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

//storeTrainingPlan
export async function storeTrainingPlan(
  req: AuthenticatedRequest & PlanBody,
  res: Response
) {
  try {
    const userId = req.user.userId;
    const { clientData, chatGPTAnswer } = req.body;

    const validClientData = clientData as ClientData;

    console.log("storeDietPlan, clientData: ", validClientData);

    const storedPlan = await prisma.plan.create({
      data: {
        type: "TRAINING",
        clientFirstName: clientData.clientFirstName,
        clientLastName: clientData.clientLastName,
        clientEmail: clientData.clientEmail,
        dietPlan: chatGPTAnswer,
        userId: userId,
      },
    });
    res
      .status(201)
      .json({ message: "Schedule stored succesfully", storedPlan });
    return;
  } catch (error) {
    console.log("generateTrainingPlan error", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

//getMySchedules
export async function getMySchedules(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user.userId;

    const mySchedules = await prisma.plan.findMany({
      where: {
        userId,
      },
    });

    if (mySchedules.length === 0) {
      res.status(404).json({ message: "No schedules found for this user" });
      return;
    }

    res.status(200).json({
      message: "Schedules retrieved successfully",
      schedules: mySchedules,
    });
    return;
  } catch (error) {
    console.log("getMySchedules error", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

//getScheduleById
export async function getScheduleById(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const planId = req.params.id;

    const scheduleById = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });
    if (!scheduleById) {
      res.status(404).json({ message: "No such schedule found" });
      return;
    }

    if (scheduleById.userId !== req.user.userId) {
      res.status(403).json({ message: "Not authorized to view this schedule" });
      return;
    }
    res.status(200).json({
      message: "Schedule retrieved successfully",
      schedule: scheduleById,
    });
    return;
  } catch (error) {
    console.log("getScheduleById error", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
