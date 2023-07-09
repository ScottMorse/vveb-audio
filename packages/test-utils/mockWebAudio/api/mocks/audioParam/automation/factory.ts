import { AutomationTimelineOptions } from "./AutomationTimeline"
import { ChromiumAutomationTimeline } from "./ChromiumAutomationTimeline"

const TIMELINE_TYPES = {
  chromium: ChromiumAutomationTimeline,
} as const

export type AutomationTimelineType = keyof typeof TIMELINE_TYPES

export const createAutomationTimeline = <T extends AutomationTimelineType>(
  type: T,
  options: AutomationTimelineOptions
) => new TIMELINE_TYPES[type](options)
