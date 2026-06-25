"use client";

import WizardingRulebookLayout, { RuleList, JudgingList } from "./WizardingRulebookLayout";
import { EXHIBITION_RULES, HARDWARE_TRACKS } from "@/lib/routes";

export default function ExhibitionDetails() {
  const trackData = HARDWARE_TRACKS.find(t => t.slug === "exhibition");
  const color = trackData?.color || "#22C55E";

  const chapters = [
    {
      id: "eligibility",
      title: "Eligibility & Format",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Eligibility</h3>
            <RuleList items={EXHIBITION_RULES.eligibility} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Exhibition Format</h3>
            <JudgingList criteria={EXHIBITION_RULES.exhibitionFormat} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "categories",
      title: "Categories & Rules",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Project Categories</h3>
            <RuleList items={EXHIBITION_RULES.projectCategories} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Exhibition Rules</h3>
            <RuleList items={EXHIBITION_RULES.exhibitionRules} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "judging",
      title: "Judging Criteria",
      content: (
        <div className="space-y-8">
          <div>
            <JudgingList criteria={EXHIBITION_RULES.judgingCriteria} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "logistics",
      title: "Logistics & Notes",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>What to Bring</h3>
            <RuleList items={EXHIBITION_RULES.whatToBring} color={color} />
          </div>
          <div className="mt-8 p-6 bg-[#EF444410] border border-[#EF444430] rounded-sm relative">
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4 text-[#EF4444]">Important Notes</h3>
            <RuleList items={EXHIBITION_RULES.notes} color="#EF4444" />
          </div>
        </div>
      )
    }
  ];

  return <WizardingRulebookLayout trackData={trackData} rules={EXHIBITION_RULES} chapters={chapters} />;
}
