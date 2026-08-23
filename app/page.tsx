import fs from "fs";
import path from "path";
import ScaleStage from "@/components/ScaleStage";

function readContent(filename: string) {
  return fs.readFileSync(path.join(process.cwd(), "content", filename), "utf8");
}

export default function Page() {
  const heroHtml = readContent("hero-body.html");
  const dishes1Html = readContent("dishes-slide1.html");
  const dishes2Html = readContent("dishes-slide2.html");
  const dishes3Html = readContent("dishes-slide3.html");

  return (
    <main className="w-full bg-black">
      <ScaleStage html={heroHtml} />
      <ScaleStage html={dishes1Html} designWidth={1527.58} designHeight={1080} />
      <ScaleStage html={dishes2Html} designWidth={1527.58} designHeight={1080} />
      <ScaleStage html={dishes3Html} designWidth={1527.58} designHeight={1080} />
    </main>
  );
}
