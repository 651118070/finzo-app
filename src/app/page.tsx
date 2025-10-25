// "use client";

// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import React from "react";
// import budgets from "./data";
// import BudgetItem from "@/components/BudgetItem";
// import { Card, CardContent } from "@/components/ui/card";
// import Footer from "@/components/Footer";

// export default function Home() {
//   const { isLoaded, isSignedIn } = useUser();

//   return (
//     <div className="flex flex-col items-center gap-4 md:mt-10 mt-15 h-screen font-roboto">
//       <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
//         Bienvenue sur Finzo
//       </h1>

//       <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-4">
//         Votre gestion financière personnelle, simplifiée et professionnelle — la
//         solution SaaS qui vous accompagne au quotidien.
//       </p>

//       {isLoaded && isSignedIn ? (
//         <div className="flex flex-col items-center w-full">
//           {/* Dashboard Access Button */}
//           <div className="flex justify-center w-full">
//             <Button
//               className="bg-emerald-500 text-white mb-4 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 md:w-1/3 w-2/3"
//               asChild
//             >
//               <a href="/dashboard">Accéder au tableau de bord</a>
//             </Button>
//           </div>

//           {/* Budget Grid */}
//           <div className="grid md:grid-cols-3 gap-4 w-full px-4">
//             {budgets.map((budget) => (
//               <Link href={`/manage/${budget.id}`} key={budget.id}>
//                 <BudgetItem budget={budget} />
//               </Link>
//             ))}
//           </div>
//           <div className="w-full p-4 flex justify-center">
//             <Card className="dark:bg-transparent md:w-1/2  ">
//               <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-center">
//                 <Link href="/pricing">
//                   {" "}
//                   <Button className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 ">
//                     Voir nos packages
//                   </Button>
//                 </Link>
//                 <Link href="/dashboard">
//                   <Button className=" text-white hover:text-white bg-slate-600 hover:bg-slate-700">
//                     Accedez au tableau de bord
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center gap-4 w-full">
//           {/* Buttons */}
//           <div className="flex justify-center gap-4">
//             <Link href="/sign-in">
//               <Button className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
//                 Commencer
//               </Button>
//             </Link>
//             <Button
//               className="bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
//               variant="outline"
//             >
//               En savoir plus
//             </Button>
//           </div>

//           {/* Budget Grid */}
//           <div className="grid md:grid-cols-3 gap-4 w-full px-4">
//             {budgets.map((budget) => (
//               <Link href={`/manage/${budget.id}`} key={budget.id}>
//                 <BudgetItem budget={budget} />
//               </Link>
//             ))}
//           </div>
//           <div className="w-full p-4 flex justify-center">
//             <Card className="dark:bg-transparent bg-slate-50 w-1/2 ">
//               <CardContent className="p-4 flex gap-4 justify-center">
//                 <Link href="/pricing">
//                   {" "}
//                   <Button className="bg-emerald-500 text-white hover:text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 ">
//                     Voir nos packages
//                   </Button>
//                 </Link>
//                 <Link href="/sign-in">
//                   <Button className=" text-white hover:text-white hover:bg-slate-900 bg-slate-600">
//                     Se connecter
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BarChart3, FileText, PieChart, Wallet } from "lucide-react";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  // Simulated data (peut venir du backend plus tard)
  const stats = [
    { label: "Utilisateurs actifs", value: "1,245" },
    { label: "Budgets créés", value: "3,680" },
    { label: "Transactions enregistrées", value: "12,950" },
  ];

  const features = [
    {
      icon: Wallet,
      title: "Création de budgets",
      description:
        "Créez et gérez facilement vos budgets mensuels ou hebdomadaires selon vos besoins financiers.",
    },
    {
      icon: BarChart3,
      title: "Suivi des transactions",
      description:
        "Ajoutez, classez et visualisez vos transactions pour garder une vue claire de vos dépenses et revenus.",
    },
    {
      icon: FileText,
      title: "Export en PDF",
      description:
        "Exportez vos transactions en un fichier PDF téléchargeable pour vos archives ou analyses.",
    },
    {
      icon: PieChart,
      title: "Visualisation graphique",
      description:
        "Analysez vos dépenses à travers des graphiques interactifs et compréhensibles.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Créez votre compte",
      text: "Inscrivez-vous gratuitement en quelques secondes et personnalisez votre profil.",
    },
    {
      step: "2",
      title: "Configurez vos budgets",
      text: "Ajoutez vos catégories de dépenses et vos objectifs financiers.",
    },
    {
      step: "3",
      title: "Ajoutez vos transactions",
      text: "Saisissez vos revenus et dépenses pour un suivi précis au quotidien.",
    },
    {
      step: "4",
      title: "Exportez en PDF",
      text: "Téléchargez vos rapports et visualisez vos performances en un clic.",
    },
  ];

  const testimonials = [
    {
      name: "Clarisse Ndanga",
      role: "Étudiante à l’Université de Yaoundé I",
      content:
        "Finzo m’a permis de mieux gérer mes dépenses mensuelles. J’aime surtout la clarté des graphiques et la facilité d’utilisation.",
    },
    {
      name: "Boris Tchinda",
      role: "Jeune Entrepreneur à Douala",
      content:
        "Grâce à Finzo, je contrôle mes finances d’entreprise sans stress. C’est un outil moderne et adapté à notre réalité camerounaise.",
    },
    {
      name: "Mireille Nkwenti",
      role: "Comptable à Bafoussam",
      content:
        "L’export PDF est une fonctionnalité que j’adore ! Je peux présenter mes rapports financiers de manière propre et professionnelle.",
    },
    {
      name: "Emmanuel Fombu",
      role: "Employé de banque à Yaoundé",
      content:
        "Depuis que j’utilise Finzo, j’ai une meilleure visibilité sur mes dépenses. C’est vraiment pratique et bien pensé.",
    },
    {
      name: "Vanessa Mbappe",
      role: "Cheffe de projet à Douala",
      content:
        "Finzo m’aide à suivre mes budgets d’équipe et à rendre compte efficacement. L’interface est fluide et agréable à utiliser.",
    },
    {
      name: "Lionel Etoundi",
      role: "Enseignant à Garoua",
      content:
        "Avec Finzo, j’ai enfin un outil simple pour gérer mes dépenses sans me perdre dans les calculs.",
    },
  ];
  

  return (
    <div className="flex flex-col items-center font-roboto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-10 px-4">
        <motion.h1
          className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Bienvenue sur Finzo
        </motion.h1>

        <motion.p
          className="text-lg text-slate-600 dark:text-slate-400 mb-6 md:w-2/3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Votre gestion financière personnelle, simplifiée et professionnelle —
          la solution SaaS qui vous accompagne au quotidien.
        </motion.p>

        {isLoaded && isSignedIn ? (
        <div className="flex justify-between space-x-4">
           <Link href="/dashboard">
            <Button className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
              Accéder au tableau de bord
            </Button>
          </Link>
           <Link href="/pricing">
           <Button
             variant="outline"
             className="text-slate-900 dark:text-white"
           >
             Voir nos packages
           </Button>
         </Link>
         </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                Commencer
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="text-slate-900 dark:text-white"
              >
                Voir nos packages
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <motion.section
        className="grid md:grid-cols-3 gap-6 my-16 w-full max-w-5xl px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="text-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-3xl font-bold text-emerald-500">{stat.value}</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Features Section */}
      <section className="my-10 w-full max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          Fonctionnalités principales
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="dark:bg-slate-800 hover:shadow-lg transition">
                <CardHeader className="flex flex-col items-center">
                  <f.icon className="w-10 h-10 text-emerald-500 mb-2" />
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="my-16 w-full max-w-5xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          Comment ça marche ?
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-emerald-500 text-2xl font-bold mb-2">
                Étape {step.step}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="my-16 w-full max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">
          Ce que disent nos utilisateurs
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <p className="italic text-slate-700 dark:text-slate-300 mb-4">
                “{t.content}”
              </p>
              <h4 className="font-semibold text-emerald-500">{t.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
