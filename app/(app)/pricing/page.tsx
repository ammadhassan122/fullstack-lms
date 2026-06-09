import { redirect } from "next/navigation";

/** Billing removed — all courses are free for students. */
export default function PricingPage() {
  redirect("/dashboard");
}
