"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FRAMEWORKS,
  PACKAGE_MANAGERS,
  CATEGORIES,
  GROUP_WARNINGS,
} from "../lib/stackData";
import { buildCommand } from "../lib/buildCommend";
import Terminal from "./terminal";
import StackButton from "./stack-button";
import ConflictWarnings from "./conflict-warnings";

export default function QuickCraft() {
  const [selectedFramework, setSelectedFramework] = useState<string>("nextjs");
  const [selectedPM, setSelectedPM] = useState<string>("npm");
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  // Mapping feature IDs to package detail structures
  const featureItemsMap = useMemo(() => {
    const map: Record<string, { pkg: string[]; dev?: boolean }> = {};
    CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        map[item.id] = { pkg: item.pkg, dev: item.dev };
      });
    });
    return map;
  }, []);

  // Mapping feature IDs to labels
  const featureLabelsMap = useMemo(() => {
    const map: Record<string, string> = {};
    CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        map[item.id] = item.name;
      });
    });
    return map;
  }, []);

  // Function to toggle selection of feature libraries
  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Calculate conflicting warning messages
  const activeWarnings = useMemo(() => {
    const groupCounts: Record<string, number> = {};
    const warningsList: string[] = [];

    selectedFeatures.forEach((id) => {
      let foundGroup: string | undefined;
      CATEGORIES.forEach((cat) => {
        const match = cat.items.find((item) => item.id === id);
        if (match && match.group) {
          foundGroup = match.group;
        }
      });

      if (foundGroup) {
        groupCounts[foundGroup] = (groupCounts[foundGroup] || 0) + 1;
      }
    });

    Object.entries(groupCounts).forEach(([group, count]) => {
      if (count > 1 && GROUP_WARNINGS[group]) {
        warningsList.push(GROUP_WARNINGS[group]);
      }
    });

    return warningsList;
  }, [selectedFeatures]);

  // Selected stack item names for summary chips
  const selectedStackNames = useMemo(() => {
    const names: string[] = [];
    const fw = FRAMEWORKS.find((f) => f.id === selectedFramework);
    if (fw) names.push(fw.name);

    selectedFeatures.forEach((id) => {
      const label = featureLabelsMap[id];
      if (label) names.push(label);
    });
    return names;
  }, [selectedFramework, selectedFeatures, featureLabelsMap]);

  // Generated setup shell commands
  const { command } = useMemo(() => {
    const res = buildCommand(
      selectedFramework,
      selectedPM,
      selectedFeatures,
      featureItemsMap
    );
    return { command: res.full };
  }, [selectedFramework, selectedPM, selectedFeatures, featureItemsMap]);

  return (
    <section className="min-h-screen bg-black/10 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Selectors & Details */}
          <div className="lg:col-span-7 space-y-12">
            {/* Step 1: Framework Choice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 text-xs font-mono font-bold text-violet-400 border border-violet-500/20">
                  01
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Choose a Framework
                </h2>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Select the base framework that powers your application development setup.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FRAMEWORKS.map((fw) => {
                  const Icon = fw.icon;
                  const isActive = selectedFramework === fw.id;
                  return (
                    <button
                      key={fw.id}
                      onClick={() => setSelectedFramework(fw.id)}
                      className={`flex flex-col items-start text-left p-5 rounded-xl border transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "border-violet-400/35 bg-violet-400/10 text-violet-200"
                          : "border-white/8 bg-white/2.5 text-zinc-400 hover:border-violet-400/30 hover:text-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-5 w-5 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                        <span className={`font-mono text-sm font-semibold tracking-wide ${isActive ? "text-white" : "text-zinc-300"}`}>
                          {fw.name}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                        {fw.tag}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 2: Add Features & Libraries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 text-xs font-mono font-bold text-violet-400 border border-violet-500/20">
                  02
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Add Features & Libraries
                </h2>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Toggle packages to install alongside the base project templates.
              </p>

              <div className="space-y-6">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h3 className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                      {category.label}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = selectedFeatures.has(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleFeature(item.id)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono border transition-all duration-150 cursor-pointer ${
                              isActive
                                ? "border-violet-400/35 bg-violet-400/10 text-violet-200"
                                : "border-white/8 bg-white/2.5 text-zinc-400 hover:border-violet-400/30 hover:text-zinc-100"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-violet-400 animate-pulse" : "bg-zinc-800"
                              }`}
                            />
                            <Icon className="h-3.5 w-3.5" />
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step 3: Package Manager choice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 text-xs font-mono font-bold text-violet-400 border border-violet-500/20">
                  03
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Package Manager
                </h2>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Choose the installation command structure to match your workflow.
              </p>

              <div className="flex flex-wrap gap-3">
                {PACKAGE_MANAGERS.map((pm) => (
                  <StackButton
                    key={pm.id}
                    name={pm.name}
                    icon={pm.icon}
                    isActive={selectedPM === pm.id}
                    onClick={() => setSelectedPM(pm.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Terminal Output (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 mt-8 lg:mt-0 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Terminal command={command} selectedStack={selectedStackNames} />
            </motion.div>
            <ConflictWarnings warnings={activeWarnings} />
          </div>
        </div>
      </div>
    </section>
  );
}
