"use client";

import WizardingRulebookLayout, { RuleList } from "./WizardingRulebookLayout";
import { ROBO_TERRENCE_RULES, HARDWARE_TRACKS } from "@/lib/routes";

export default function RoboTerrenceDetails() {
  const trackData = HARDWARE_TRACKS.find(t => t.slug === "robo-terrence");
  const color = trackData?.color || "#F59E0B";

  const chapters = [
    {
      id: "rules",
      title: "General Rules & Specs",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>General Rules</h3>
            <RuleList items={ROBO_TERRENCE_RULES.generalRules} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Bot Specifications</h3>
            <RuleList items={ROBO_TERRENCE_RULES.botSpecs} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "terrain",
      title: "Terrain Challenges",
      content: (
        <div className="space-y-8">
          <div>
            <RuleList items={ROBO_TERRENCE_RULES.terrainChallenges} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "rounds",
      title: "Tournament Rounds",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Preliminary Round</h3>
            <RuleList items={ROBO_TERRENCE_RULES.preliminaryRound} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Final Round</h3>
            <RuleList items={ROBO_TERRENCE_RULES.finalRound} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "judging",
      title: "Judging & Notes",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Judging Criteria</h3>
            <RuleList items={ROBO_TERRENCE_RULES.judgingCriteria} color={color} />
          </div>
          <div className="mt-8 p-6 bg-[#EF444410] border border-[#EF444430] rounded-sm relative">
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4 text-[#EF4444]">Important Notes</h3>
            <RuleList items={ROBO_TERRENCE_RULES.notes} color="#EF4444" />
          </div>
        </div>
      )
    }
  ];

  return <WizardingRulebookLayout trackData={trackData} rules={ROBO_TERRENCE_RULES} chapters={chapters} />;
}
