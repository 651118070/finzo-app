import React from "react"
import PricingPlans from "./__components/pricing"
import Footer from "@/components/Footer"
export default function PricingTable() {
 return(
<div className="flex flex-col min-h-screen">
  <div className="flex-grow">
    <PricingPlans />
  </div>
  <footer className="flex items-end">
    <Footer />
  </footer>
</div>

 )
}
