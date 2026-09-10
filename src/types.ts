export type Level = "ok" | "warning" | "error";

export interface Diagnostic {
  id: string;
  level: Level;
  message: string;
  detail?: string;
}

export interface CommandReport {
  command: string;
  ok: boolean;
  diagnostics: Diagnostic[];
}

export interface InitReport {
  command: "init";
  ok: boolean;
  dryRun: boolean;
  created: string[];
  updated: string[];
  unchanged: string[];
  preserved: string[];
  conflicts: string[];
}
