"use client";

import WizardingRulebookLayout, { RuleList, JudgingList } from "./WizardingRulebookLayout";
import { ROBO_SUMO_RULES, HARDWARE_TRACKS } from "@/lib/routes";

export default function RoboSumoDetails() {
  const trackData = HARDWARE_TRACKS.find(t => t.slug === "robo-sumo");
  const color = trackData?.color || "#EF4444";

  const chapters = [
    {
      id: "format",
      title: "Format & Rules",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Match Format</h3>
            <RuleList items={ROBO_SUMO_RULES.matchFormat} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Team Rules</h3>
            <RuleList items={ROBO_SUMO_RULES.teamRules} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "specs",
      title: "Bot Specifications",
      content: (
        <div>
          <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Technical Requirements</h3>
          <RuleList items={ROBO_SUMO_RULES.botSpecs} color={color} />
        </div>
      )
    },
    {
      id: "combat",
      title: "Combat & Victory",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Combat Rules</h3>
            <RuleList items={ROBO_SUMO_RULES.combatRules} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Victory Conditions</h3>
            <RuleList items={ROBO_SUMO_RULES.victoryConditions} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "judging",
      title: "Judging & Safety",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Judging Criteria</h3>
            <JudgingList criteria={ROBO_SUMO_RULES.judgingCriteria} color={color} />
          </div>
          <div className="mt-8 p-6 bg-[#EF444410] border border-[#EF444430] rounded-sm relative">
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4 text-[#EF4444]">Safety Regulations</h3>
            <RuleList items={ROBO_SUMO_RULES.safety} color="#EF4444" />
          </div>
          <div className="mt-8">
             <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Important Notes</h3>
             <RuleList items={ROBO_SUMO_RULES.notes} color={color} />
          </div>
        </div>
      )
    }
  ];

  return <WizardingRulebookLayout trackData={trackData} rules={ROBO_SUMO_RULES} chapters={chapters} />;
}
