import SakuraUniversalStudio from "@/components/SakuraUniversalStudio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Device Visual Studio — Restaurant Design Workbench",
  description: "Live interactive device simulator, layout editor, and calibrator for the Sushi Restaurant experience.",
};

export default function StudioPage() {
  return <SakuraUniversalStudio />;
}
