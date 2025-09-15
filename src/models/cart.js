// src/models/cart.js
import { z } from "zod";

// Helpers
const isoDate = z.string().refine(
  (s) => !Number.isNaN(Date.parse(s)),
  "Invalid date"
);

export const WorkflowStep = z.object({
  team: z.string().min(1),
  actor: z.string().min(1),
  decision: z.enum(["Approved", "Rejected", "Pending"]),
  decidedAt: z.string().nullable().optional(), // allow empty -> null later
});

export const CartRequest = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["Business Case", "RFP", "SAD", "SRS", "BRS"]),
  status: z.enum([
    "Under Review Cycle 1",
    "Approved", 
    "Respond Cycle 1", 
    "Under Review Cycle 2", 
    "Rejected", 
    "Stakeholder Rejected", 
    "Respond Cycle 2", 
    "Under Review Cycle 3", 
    "For Stakeholder Signoff", 
    "Respond Chairperson", 
    "Draft"
]),
  department: z.string(),
  submissionDate: isoDate,
  planningClosureDate: z.string().nullable().optional(),
  summary: z.string().optional(),
//   workflow: z.array(WorkflowStep).default([]),
});

export const CartResponse = z.object({
  items: z.array(CartRequestSchema),
  total: z.number(),
});

export { z };
