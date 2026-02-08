'use client';

import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WeightWithTooltipProps {
  gramsPerServing: number;
  maxGramsPerServing?: number;
}

export default function WeightWithTooltip({ gramsPerServing, maxGramsPerServing }: WeightWithTooltipProps) {
  const t = useTranslations();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-blue font-bold text-base md:text-2xl inter mb-4 md:mb-7 cursor-help">
            {gramsPerServing}{maxGramsPerServing && ` - ${maxGramsPerServing}`} {t('weight')}
          </span>
        </TooltipTrigger>
        {maxGramsPerServing && (
          <TooltipContent className="max-w-[300px] bg-white border-gray-200">
            <p className="text-sm">
              {t('weight-tooltip', { 
                min: gramsPerServing, 
                max: maxGramsPerServing 
              })}
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
