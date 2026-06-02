import "dotenv/config";
import mongoose from "mongoose";
import { format, subDays } from "date-fns";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import AIInsight from "../models/AIInsight.js";
import { toDayKey, toDateKey } from "../utils/dateHelpers.js";

// ─── Config ──────────────────────────────────────────────────────────────────

const EMAIL = "muhammad2372002@gmail.com";
const PASSWORD = "m123456";
const NAME = "Muhammad Osama";

// ─── Habit definitions ───────────────────────────────────────────────────────
// _streakProb : base daily completion probability (0–1)
// _pattern    : "weekdays" — drops weekend probability
//               "dropoff"  — drops recent-14-days probability (simulates slump)
// _brokeAt    : skips a window of days to break the streak at that offset

const HABITS = [
  {
    name: "Drink 2L of water",
    description: "Stay hydrated throughout the day.",
    category: "Health",
    frequency: "daily",
    targetDays: 7,
    color: "#0ea5e9",
    icon: "💧",
    _streakProb: 0.95,
  },
  {
    name: "Morning run",
    description: "30-minute run before breakfast.",
    category: "Fitness",
    frequency: "daily",
    targetDays: 5,
    color: "#ef4444",
    icon: "🏃",
    _streakProb: 0.7,
    _pattern: "weekdays",
    _brokeAt: 20,
  },
  {
    name: "Read 20 minutes",
    description: "Fiction or non-fiction, no phone.",
    category: "Learning",
    frequency: "daily",
    targetDays: 7,
    color: "#6366f1",
    icon: "📚",
    _streakProb: 0.82,
  },
  {
    name: "Meditate",
    description: "10 minutes of focused breathing.",
    category: "Mindfulness",
    frequency: "daily",
    targetDays: 7,
    color: "#a855f7",
    icon: "🧘",
    _streakProb: 0.6,
    _pattern: "dropoff", // simulates a recent slump — good for recovery card
  },
];

// ─── Log generation ──────────────────────────────────────────────────────────

/**
 * Deterministic pseudo-random based on both day offset AND habit name,
 * so habits with the same name length still get distinct log patterns.
 */
const pseudoRandom = (dayOffset, habitName) => {
  let hash = 0;
  for (let k = 0; k < habitName.length; k++) {
    hash = (hash * 31 + habitName.charCodeAt(k)) >>> 0;
  }
  const seed = Math.sin(dayOffset * 9301 + hash * 49297) * 233280;
  return seed - Math.floor(seed);
};

const buildLogs = (habit, totalDays = 90) => {
  const logs = [];
  const today = new Date();

  for (let i = 0; i < totalDays; i++) {
    const d = subDays(today, i);
    const dow = d.getDay(); // 0 = Sun, 6 = Sat
    const key = format(d, "yyyy-MM-dd");
    let p = habit._streakProb;

    if (habit._pattern === "weekdays") {
      // Significantly less likely on weekends
      if (dow === 0 || dow === 6) p *= 0.35;
    }

    if (habit._pattern === "dropoff") {
      // Recent 14 days show a slump — activates the streak-recovery card
      if (i < 14) p *= 0.2;
    }

    // Create a visible streak break around _brokeAt
    if (habit._brokeAt && i >= habit._brokeAt - 1 && i <= habit._brokeAt + 1) {
      continue;
    }

    if (pseudoRandom(i, habit.name) < p) {
      logs.push({ completedDate: key });
    }
  }

  return logs;
};

// ─── Sample AI insights ──────────────────────────────────────────────────────

const buildInsights = (userId) => [
  {
    userId,
    type: "weekly",
    content:
      "Great week overall! You hit your hydration goal every single day. " +
      "Your reading streak is looking strong at 6 days. " +
      "Consider scheduling your morning run the night before to boost consistency on weekdays.",
    meta: { weekOf: toDateKey(subDays(new Date(), 7)) },
    generatedAt: subDays(new Date(), 1),
  },
  {
    userId,
    type: "suggestion",
    content:
      "Based on your learning habit, you might enjoy adding a 'Write for 10 minutes' habit. " +
      "Users who combine reading with reflective writing retain 40% more.",
    meta: { category: "Learning" },
    generatedAt: subDays(new Date(), 3),
  },
  {
    userId,
    type: "morning",
    content:
      "Good morning! You've completed your hydration habit 18 days in a row. " +
      "Today is a great day to push that morning run — you've got this.",
    meta: {},
    generatedAt: new Date(),
  },
];

// ─── Runner ──────────────────────────────────────────────────────────────────

const run = async () => {
  await connectDB();

  // ── Upsert user ────────────────────────────────────────────────────────────
  let user = await User.findOne({ email: EMAIL });

  if (user) {
    console.log(`Found existing user ${EMAIL} — clearing their habit data…`);
    await Promise.all([
      Habit.deleteMany({ userId: user._id }),
      HabitLog.deleteMany({ userId: user._id }),
      AIInsight.deleteMany({ userId: user._id }),
    ]);
    // Fix field name: schema uses morningMotivation (not monringMotivation)
    user.name = NAME;
    user.avatar = NAME.charAt(0).toUpperCase();
    user.morningMotivation = true;
    user.password = PASSWORD; // pre-save hook will re-hash
    await user.save();
  } else {
    user = await User.create({
      name: NAME,
      email: EMAIL,
      password: PASSWORD,
      avatar: NAME.charAt(0).toUpperCase(),
      morningMotivation: true,
    });
    console.log(`Created user ${EMAIL}`);
  }

  // ── Create habits ──────────────────────────────────────────────────────────
  const createdHabits = [];
  const habitStart = subDays(new Date(), 89);

  for (let i = 0; i < HABITS.length; i++) {
    const h = HABITS[i];

    // Create with Mongoose to get _id, then backdateusing updateOne to bypass
    // the timestamps middleware (save({ timestamps: false }) has no effect in
    // Mongoose — only a direct updateOne call skips the automatic field update)
    const habit = await Habit.create({
      userId: user._id,
      name: h.name,
      description: h.description,
      category: h.category,
      frequency: h.frequency,
      targetDays: h.targetDays,
      color: h.color,
      icon: h.icon,
      order: i,
    });

    await Habit.updateOne(
      { _id: habit._id },
      { $set: { createdAt: habitStart, updatedAt: habitStart } },
    );

    createdHabits.push({ habit, config: h });
  }

  // ── Insert historical logs ─────────────────────────────────────────────────
  let totalLogs = 0;

  for (const { habit, config } of createdHabits) {
    const logs = buildLogs(config);
    if (!logs.length) continue;

    const docs = logs.map((l) => ({
      userId: user._id,
      habitId: habit._id,
      completedDate: l.completedDate,
    }));

    const result = await HabitLog.insertMany(docs, {
      ordered: false,
      // ignore duplicate-key errors from the unique index, surface others
    }).catch((err) => {
      const isDuplicateOnly =
        err.code === 11000 || err.writeErrors?.every((e) => e.code === 11000);
      if (!isDuplicateOnly) throw err;
      return { insertedCount: err.insertedDocs?.length ?? 0 };
    });

    totalLogs += result.insertedCount ?? docs.length;
  }

  // ── Mark today's logs for the first two habits (demo dashboard state) ──────
  const today = toDayKey();
  const todayDoneHabits = createdHabits.slice(0, 2).map((c) => c.habit);

  for (const h of todayDoneHabits) {
    await HabitLog.updateOne(
      { userId: user._id, habitId: h._id, completedDate: today },
      {
        $setOnInsert: {
          userId: user._id,
          habitId: h._id,
          completedDate: today,
        },
      },
      { upsert: true },
    );
  }

  // ── Seed AI insights ───────────────────────────────────────────────────────
  const insights = buildInsights(user._id);
  await AIInsight.insertMany(insights);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete");
  console.log(`   User     : ${EMAIL}`);
  console.log(`   Password : ${PASSWORD}`);
  console.log(`   Habits   : ${createdHabits.length}`);
  console.log(`   Logs     : ${totalLogs}`);
  console.log(`   Insights : ${insights.length}`);

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
