import { Request, Response } from "express";
import { ChatGPTResponse } from "../../types/chatGPT";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../../types/express";


const prisma = new PrismaClient()
export const generateTrainingPlan = async (req: AuthenticatedRequest, res: Response) => {
  
  const formData = req.body.answers;

  if (!formData) {
    res.json({ message: "Error: no form data received" });
    return 
  }

  console.log("Incoming data", formData);

  /*
    Vänligen returnera ditt svar med denna struktur: 

    {...}
  */

  const prompt = `
  Du är en personlig tränare. Använd följande klientinformation för att skapa ett anpassat träningsschema.
  
  Returnera enbart ett träningsschema i form av ett **JSON-objekt** som kan användas direkt i en app. Inkludera inga förklaringar eller extra text.

  Om du har extra tips, lägg in de gärna i en notes-nyckel. Använd bara strängar som primitiva värde
  

  Användarens fomulärsvar:
  - Förnamn: ${formData.person.firstName}.
  - Efternamn: ${formData.person.lastName}.
  - Kön: ${formData.person.sex}.
  - Ålder: ${formData.person.age}.
  - E-post: ${formData.person.mail}.
  - Längd: ${formData.person.height}cm.
  - Vikt: ${formData.person.weight}kg.
  - Träningsmål: ${formData.goals.join(", ")}.
  - Träningsvana: ${formData.exerciseHabit}.
  - Träningsfrekvens: ${formData.trainingFreq}.
  - Träningsform: ${formData.trainingType.join(", ")}.
  - Tillgång till utrustning: ${formData.trainingGear.join(", ")}.
  - Träningsnivå (1-5): ${formData.trainingLevel}.
  - Fysisk form: ${formData.fitnessLevel}.
  - Hälsostatus: ${formData.healthStatus}.
  - Sömn per natt: ${formData.sleepHours}.
  - Upplever livsstress: ${formData.lifeStress}.
  - Specifika preferenser: ${formData.trainingPreferences}.
  - Slutmål: ${formData.endGoal}.
  
  Skapa ett schema som passar denna person - fokusera på deras mål och träningsnivå.
  `;

  console.log(prompt);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data: ChatGPTResponse = await response.json();
    console.log("generateTrainingPlan, ChatGPTResponse: ", data);

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
    return 
  } catch (error) {
    res.status(500).json({ error: "Something went wrong: " + error.message });
    return;
  }
};

//==================================================================================================================================================
//==================================================================================================================================================
//==================================================================================================================================================
//==================================================================================================================================================
//==================================================================================================================================================
//==================================================================================================================================================
//==================================================================================================================================================

export const generateDietPlan = async (req: Request, res: Response) => {
  const formData = req.body.answers;

  if (!formData) {
    res.json({ message: "Error: no form data received" });
    return 
  }

  console.log("Incoming data", formData);

  /*
    Vänligen returnera ditt svar med denna struktur:  

    {...}
  */

  const prompt = `
  Du är en personlig dietist. Använd följande klientinformation för att skapa ett anpassat kostschema.
  
  Returnera enbart ett kostschema i form av ett **JSON-objekt** som kan användas direkt i en app. Inkludera inga förklaringar eller extra text.
  
  Om du har extra tips, lägg in de gärna i en notes-nyckel. Använd bara strängar som primitiva värde.

  Användarens fomulärsvar:
  - Förnamn: ${formData.person.firstName}.
  - Efternamn: ${formData.person.lastName}.
  - Kön: ${formData.person.sex}.
  - Ålder: ${formData.person.age}.
  - E-post: ${formData.person.mail}.
  - Längd: ${formData.person.height}cm.
  - Vikt: ${formData.person.weight}kg.
  - Dietmål: ${formData.goal}.
  - Daglig aptit: ${formData.dailyAppetite.choice}, ${formData.dailyAppetite.extraText}.
  - Kaloriintag: ${formData.calorieIntake.choice}, ${formData.calorieIntake.extraText}.
  - Diet preferenser: ${formData.dietPreferences}.
  - Diet Historik: ${formData.dietHistory}.
  - Kosttillskott: ${formData.dietarySupp}.
  - Dryckesvanor: ${formData.drinkingHabits}.
  - Ätstörningshistoria: ${formData.eatingDisorderHistory.choice}, ${formData.eatingDisorderHistory.extraText}.
  - Sömn per natt: ${formData.sleepHours}.
  - Matvanor: ${formData.eatingHabits}.
  - Ätmönster: ${formData.eatingPatterns.choice}, ${formData.eatingPatterns.extraText}.
  - Träningsvana: ${formData.exerciseHabit}.
  - Vätskeintag: ${formData.fluidIntake}.
  - Matinställningar: ${formData.foodPreferences}.
  - Hälsostatus: ${formData.healthStatus}.
  - Måltidsportion: ${formData.mealPortion.choice}, ${formData.mealPortion.extraText}.
  - Dagliga måltider: ${formData.dailyMeals}.
  - Önskar kostillskott: ${formData.suppInclusion}.
  - Tidsram: ${formData.timeframe.choice}, ${formData.timeframe.extraText}.
  Skapa ett schema som passar denna person - fokusera på deras mål och träningsnivå.
  `;

  console.log(prompt);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data: ChatGPTResponse = await response.json();
    console.log("generateDietPlan, ChatGPTResponse: ", data);

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
    return 
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong: " + error.message });
      return 
  }
};
