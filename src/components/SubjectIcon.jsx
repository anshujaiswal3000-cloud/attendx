import React from "react";
import {
  ComputerRounded,
  CodeRounded,
  StorageRounded,
  LayersRounded,
  MemoryRounded,
  BarChartRounded,
  SchoolRounded,
  DeveloperModeRounded,
  CalculateRounded,
  PsychologyRounded,
  SmartToyRounded,
  HtmlRounded,
  MenuBookRounded,
  HelpOutlineRounded,
} from "@mui/icons-material";

const iconsMap = {
  Computer: ComputerRounded,
  Code: CodeRounded,
  Storage: StorageRounded,
  Layers: LayersRounded,
  Memory: MemoryRounded,
  BarChart: BarChartRounded,
  School: SchoolRounded,
  DeveloperMode: DeveloperModeRounded,
  Calculate: CalculateRounded,
  Psychology: PsychologyRounded,
  SmartToy: SmartToyRounded,
  Html: HtmlRounded,
  MenuBook: MenuBookRounded,
};

export function SubjectIcon({ name, ...props }) {
  const IconComponent = iconsMap[name] || HelpOutlineRounded;
  return <IconComponent {...props} />;
}
