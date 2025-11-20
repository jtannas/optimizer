// Concept: Optimizer for character progression in Tacticus

// The initial idea was that it'd minimize the number of (days * missing ranks)
// across all goal characters, given a daily energy budget and the nodes available.
// That's probably too complex for now, so I'm starting with a simpler version.

// It'll determine the number of days required to reach the given character goal.
// This is the maximum of either:
// a) the number of days to farm a single required materials
//      e.g. if you need 30 of material X, and you can get 5 per day, that's 6 days
// b) the number of days to farm all materials given the energy budget
//      e.g. if you need a total of 500 energy worth of materials, and you have
//      200 energy per day, that's 3 days (2.5 rounded up)

// The tricky part from case A (the bottleneck case) is that if we allocate the maximum
// possible energy to farming the bottleneck material, that takes away from the energy
// budget for farming other materials, which may in turn create new bottlenecks.

// e.g.
// - you have 8 raids per day to spend
// - you need 64 common materials
// - you need 60 legendary materials but are limited to 6 per day

// e.g. Prioritizing the legendary material that takes a long time to farm:
// Day  0:                                    -> 60 legendary left, 64 commons left
// Day  1: 6/8 on legendary, 2/8 on commons   -> 54 legendary left, 62 commons left
// Day  2: 6/8 on legendary, 2/8 on commons   -> 48 legendary left, 60 commons left
// Day  3: 6/8 on legendary, 2/8 on commons   -> 42 legendary left, 58 commons left
// Day  4: 6/8 on legendary, 2/8 on commons   -> 36 legendary left, 56 commons left
// Day  5: 6/8 on legendary, 2/8 on commons   -> 30 legendary left, 54 commons left
// Day  6: 6/8 on legendary, 2/8 on commons   -> 24 legendary left, 52 commons left
// Day  7: 6/8 on legendary, 2/8 on commons   -> 18 legendary left, 50 commons left
// Day  8: 6/8 on legendary, 2/8 on commons   -> 12 legendary left, 48 commons left
// Day  9: 6/8 on legendary, 2/8 on commons   -> 6 legendary left, 46 commons left
// Day 10: 6/8 on legendary, 2/8 on commons   -> 0 legendary left, 44 commons left
// Day 11: 8/8  on commons                    -> 0 legendary left, 36 commons left
// Day 12: 8/8  on commons                    -> 0 legendary left, 28 commons left
// Day 13: 8/8  on commons                    -> 0 legendary left, 20 commons left
// Day 14: 8/8  on commons                    -> 0 legendary left, 12 commons left
// Day 15: 8/8  on commons                    -> 0 legendary left, 4 commons left
// Day 16: 8/8  on commons                    -> 0 legendary left, 0 commons left
// Total: 16 days

// This has the legendary material ready 6 days before the commons.
// If we had deferred some of the legendary farming to later days, we could
// have the common materials ready for other upgrades in the meantime.
 
// When farming legendary materials for Diamond 2 -> 3 while you're still at a low rank
// (e.g. Silver 1), this leaves a lot of days where you're not progressing your character
// at all because you're spending all your energy on materials you don't need until much later.

// I've played around with this example a bit, and I don't think it's possible
// to reduce the total number of days since that's a function of:
//     `max(ceil(total_energy_needed / daily_energy_budget), longest_single_material_days)`
// As long as you're using the planner daily to target the current bottleneck material,
// I think you'll always end up with the minimum number of days.

// I think the best we can do is...

// Determine the number of days needed based on energy required / daily budget
// Determine the bottleneck material (the one that takes the longest to farm)
// If the bottleneck material that requires the same or more days than energy allows
//   Farm that material first using all available energy that day
// Use any remaining energy that day to farm currently needed materials
// As each day passes, re-evaluate the bottleneck material

// This way, we ensure that we're always making progress towards the goal,
// while also ensuring that we address the bottleneck material before it stalls progress.

// e.g.
// Day  0:                                    -> 60 legendary left, 64 commons left
//        10 days for legendary, 124 total raids so 16 days under energy budget

// Day  1: 0/8 on legendary, 8/8 on commons   -> 60 legendary left, 56 commons left
//        10 days for legendary, 116 total raids so 15 days under energy budget

// Day  2: 0/8 on legendary, 8/8 on commons   -> 60 legendary left, 48 commons left
//        10 days for legendary, 108 total raids so 14 days under energy budget

// Day  3: 0/8 on legendary, 8/8 on commons   -> 60 legendary left, 40 commons left
//        10 days for legendary, 100 total raids so 13 days under energy budget

// Day  4: 0/8 on legendary, 8/8 on commons   -> 60 legendary left, 32 commons left
//        10 days for legendary, 92 total raids  so 12 days under energy budget

// Day  5: 0/8 on legendary, 8/8 on commons   -> 60 legendary left, 24 commons left
//        10 days for legendary, 84 total raids  so 11 days under energy budget

// Day  6: 0/8 on legendary, 8/8 on commons   -> 60 legendary left, 16 commons left
//        10 days for legendary, 76 total raids  so 10 days under energy budget

// Day  7: 6/8 on legendary, 2/8 on commons   -> 54 legendary left, 14 commons left
//         9 days for legendary, 68 total raids   so 9 days under energy budget

// Day  8: 6/8 on legendary, 2/8 on commons   -> 48 legendary left, 12 commons left
//         8 days for legendary, 60 total raids   so 8 days under energy budget

// Day  9: 6/8 on legendary, 2/8 on commons   -> 42 legendary left, 10 commons left
//         7 days for legendary, 52 total raids   so 7 days under energy budget

// Day 10: 6/8 on legendary, 2/8 on commons   -> 36 legendary left, 8 commons left
//         6 days for legendary, 44 total raids   so 6 days under energy budget

// Day 11: 6/8 on legendary, 2/8 on commons   -> 30 legendary left, 6 commons left
//         5 days for legendary, 36 total raids   so 5 days under energy budget

// Day 12: 6/8 on legendary, 2/8 on commons   -> 24 legendary left, 4 commons left
//         4 days for legendary, 28 total raids   so 4 days under energy budget

// Day 13: 6/8 on legendary, 2/8 on commons   -> 18 legendary left, 2 commons left
//         3 days for legendary, 20 total raids   so 3 days under energy budget

// Day 14: 6/8 on legendary, 2/8 on commons   -> 12 legendary left, 0 commons left
//         2 days for legendary, 12 total raids   so 2 days under energy budget

// Day 15: 6/8 on legendary, 2/8 on commons   ->  6 legendary left, 0 commons left
//         1 days for legendary, 4 total raids    so 1 day under energy budget

// Day 16: 6/8 on legendary, 2/8 on commons   ->  0 legendary left, 0 commons left
// Total: 16 days

// It gives us the same total number of days, and gets us the materials you want
// for current upgrades as early as possible.

// Thankfully this doesn't require any complex optimization logic where we plan
// out the entire farming schedule in advance.
// It's just a day-by-day "Is there a bottleneck material? If so, farm it first. If not, farm whatever you need."
