"use client";

import WizardingRulebookLayout, { RuleList, JudgingList } from "./WizardingRulebookLayout";
import { LINE_FOLLOWER_RULES, HARDWARE_TRACKS } from "@/lib/routes";

export default function LineFollowerDetails() {
  const trackData = HARDWARE_TRACKS.find(t => t.slug === "line-follower");
  const color = trackData?.color || "#06B6D4";

  const chapters = [
    {
      id: "rules",
      title: "General Rules & Specs",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>General Rules</h3>
            <RuleList items={LINE_FOLLOWER_RULES.generalRules} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Bot Specifications</h3>
            <RuleList items={LINE_FOLLOWER_RULES.botSpecs} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "track",
      title: "Track Specs & Rounds",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Track Specifications</h3>
            <RuleList items={LINE_FOLLOWER_RULES.trackSpecs} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Preliminary Round</h3>
            <RuleList items={LINE_FOLLOWER_RULES.preliminaryRound} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Final Round</h3>
            <RuleList items={LINE_FOLLOWER_RULES.finalRound} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "scoring",
      title: "Judging & Scoring",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Judging Parameters</h3>
            <RuleList items={LINE_FOLLOWER_RULES.judgingParameters} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Scoring Criteria</h3>
            <JudgingList criteria={LINE_FOLLOWER_RULES.scoringCriteria} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "notes",
      title: "Important Notes",
      content: (
        <div className="mt-8 p-6 bg-[#EF444410] border border-[#EF444430] rounded-sm relative">
          <h3 className="font-mono text-lg uppercase tracking-widest mb-4 text-[#EF4444]">Important Notes</h3>
          <RuleList items={LINE_FOLLOWER_RULES.notes} color="#EF4444" />
        </div>
      )
    }
  ];

  return <WizardingRulebookLayout trackData={trackData} rules={LINE_FOLLOWER_RULES} chapters={chapters} />;
}
