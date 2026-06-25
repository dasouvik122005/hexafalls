"use client";

import WizardingRulebookLayout, { RuleList } from "./WizardingRulebookLayout";
import { ROBO_SOCCER_RULES, HARDWARE_TRACKS } from "@/lib/routes";

export default function RoboSoccerDetails() {
  const trackData = HARDWARE_TRACKS.find(t => t.slug === "robo-soccer");
  const color = trackData?.color || "#3B82F6";

  const chapters = [
    {
      id: "rules",
      title: "General Rules & Specs",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>General Rules</h3>
            <RuleList items={ROBO_SOCCER_RULES.generalRules} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Bot Specifications</h3>
            <RuleList items={ROBO_SOCCER_RULES.botSpecs} color={color} />
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
            <RuleList items={ROBO_SOCCER_RULES.preliminaryRound} color={color} />
          </div>
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Knockout & Final Rounds</h3>
            <RuleList items={ROBO_SOCCER_RULES.knockoutRound} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "match",
      title: "Match Rules",
      content: (
        <div className="space-y-8">
          <div>
            <RuleList items={ROBO_SOCCER_RULES.matchRules} color={color} />
          </div>
        </div>
      )
    },
    {
      id: "judging",
      title: "Judging & Victory",
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4" style={{ color }}>Judging & Victory</h3>
            <p className="font-mono text-xs text-silver-hp/60 mb-6 italic">The team with the highest score or most goals at the end of regulation time will be declared the winner based on:</p>
            <RuleList items={ROBO_SOCCER_RULES.judgingAndVictory} color={color} />
          </div>
          <div className="mt-8 p-6 bg-[#EF444410] border border-[#EF444430] rounded-sm relative">
            <h3 className="font-mono text-lg uppercase tracking-widest mb-4 text-[#EF4444]">Important Notes</h3>
            <RuleList items={ROBO_SOCCER_RULES.notes} color="#EF4444" />
          </div>
        </div>
      )
    }
  ];

  return <WizardingRulebookLayout trackData={trackData} rules={ROBO_SOCCER_RULES} chapters={chapters} />;
}
