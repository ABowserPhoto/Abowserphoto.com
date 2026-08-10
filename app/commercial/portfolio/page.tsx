import fs from "fs";
import path from "path";
import CommercialPortfolioArchive from "../../../components/CommercialPortfolioArchive";
import { categoryContentMap } from "../../../lib/content";

export default function CommercialPortfolioPage() {
  const category = categoryContentMap.commercial;
  const directoryPath = path.join(process.cwd(), "public", "commercial", "portfolio");
  let portfolioImages: string[] = [];

  try {
    const files = fs.readdirSync(directoryPath);
    portfolioImages = files
      .filter((file) => !file.startsWith("."))
      .map((file) => `/commercial/portfolio/${file}`);
  } catch {
    portfolioImages = [];
  }

  return <CommercialPortfolioArchive images={portfolioImages} themeColor={category.themeColor} />;
}
