import { z } from "zod";

export const InterestSchema = z.object({
  name: z.string().min(2).max(50),
  category: z.enum(["professional", "academic", "recreational", "artistic"]),
  proficiency: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional(),
  yearsExperience: z.number().int().min(0).optional(),
});

const culturalInterestsSchema = z.object({
  music: z.array(z.string()).default([]),
  visualArts: z.array(z.string()).default([]),
  literature: z.array(z.string()).default([]),
  fashion: z.array(z.string()).default([]),
});

export const PolymathProfileSchema = z.object({
  // Core professional identity
  profession: z.string().min(2).max(100),
  professionalSummary: z.string().max(500).optional(),

  // Academic background
  academicInterests: z
    .array(
      z.object({
        field: z.string(),
        level: z.enum(["casual", "student", "researcher", "professional"]),
        description: z.string().optional(),
      }),
    )
    .default([]),

  // Key interests and passions
  passions: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        intensity: z
          .enum(["casual", "enthusiast", "dedicated"])
          .default("casual"),
      }),
    )
    .default([]),

  // Cultural interests
  culturalInterests: culturalInterestsSchema.default({
    music: [],
    visualArts: [],
    literature: [],
    fashion: [],
  }),

  // Creative outlets
  creativePursuits: z
    .array(
      z.object({
        medium: z.string(),
        description: z.string().optional(),
        isProfessional: z.boolean().default(false),
      }),
    )
    .default([]),

  // Learning goals
  currentLearning: z
    .array(
      z.object({
        topic: z.string(),
        startedAt: z.string().datetime().optional(), // Using string with datetime format instead of Date
        goal: z.string().optional(),
      }),
    )
    .default([]),

  // Social/collaborative aspects
  collaborationInterests: z.array(z.string()).default([]),

  // Optional personal philosophy or approach
  personalPhilosophy: z.string().max(1000).optional(),

  // Metadata
  lastUpdated: z.string().datetime().optional(), // Using string with datetime format instead of Date
  isPublic: z.boolean().default(false),
});

export type Interest = z.infer<typeof InterestSchema>;
export type PolymathProfile = z.infer<typeof PolymathProfileSchema>;

// Example of how this would be used with the existing user schema
export const userWithProfileSchema = z.object({
  // ... existing user schema fields would go here
  profile: PolymathProfileSchema.optional(),
});
