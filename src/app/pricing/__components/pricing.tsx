"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPlansAction } from "../../../../actions/plans/get";
import { Plan } from "@/types";
import { useRouter } from "next/navigation";

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const router=useRouter()
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlansAction();
        setPlans(res.subscription || []);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      }
    };

    fetchPlans();
  }, []);
  const handleButtonClick = (planName: string) => {
    const lowerName = planName.toLowerCase();
    if (lowerName === "pro" || lowerName === "premium") {
      const phoneNumber = "237621242854"; // Ton numéro WhatsApp
      const groupLink = "https://chat.whatsapp.com/HMk5LxGm5954ebfJfVjlrL";
    
      const message = `Bonjour,
    Je suis intéressé par le forfait "${planName}".
    En attendant notre réponse, vous pouvez rejoindre notre groupe WhatsApp (${groupLink}), où nous répondons à toutes les questions liées à l’application Finzo, pour rendre votre gestion des dépenses quotidienne plus simple et professionnelle.`;
    
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
     
   else {
      router.push("/");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 mt-5">
      {plans.map((plan, index) => (
        <Card
          key={index}
          className="rounded-2xl font-roboto shadow-md hover:shadow-xl transition-all relative"
        >
          <CardHeader>
            {index === 1 && (
              <Badge className="fixed  left-1/2 -translate-x-1/2 flex justify-center bg-emerald-500">
                Très populaire
              </Badge>
            )}
            <CardTitle className="text-center text-xl">{plan.name}</CardTitle>
            <p className="text-center text-2xl font-semibold text-primary">
              {plan.price} XAF / {plan.frequency}
            </p>
          </CardHeader>

          <CardContent>
            <ul className="mb-4 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
            onClick={()=>{handleButtonClick(plan.name)}}
              className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 w-full "
              variant="outline"
            >
              {plan.name.toLowerCase() === "starter"
                ? `Continuer avec ${plan.name}`
                : `Choisir ${plan.name}`}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
