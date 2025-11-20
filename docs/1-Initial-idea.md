# Concept: Optimizer for character progression in Tacticus

The initial idea was that it'd minimize the number of (days * missing ranks)
across all goal characters, given a daily energy budget and the nodes available.
That's probably too complex for now, so I'm starting with a simpler version.

It'll determine the number of days required to reach the given character goal.
This is the maximum of either:
a) the number of days to farm a single required materials
    e.g. if you need 30 of material X, and you can get 5 per day, that's 6 days
b) the number of days to farm all materials given the energy budget
    e.g. if you need a total of 500 energy worth of materials, and you have
    200 energy per day, that's 3 days (2.5 rounded up)

The tricky part from case A (the bottleneck case) is that if we allocate the maximum
possible energy to farming the bottleneck material, that takes away from the energy
budget for farming other materials, which may in turn create new bottlenecks.

## Example: Prioritizing the legendary material that takes a long time to farm
- you have 8 raids per day to spend
- you need 64 common materials
- you need 60 legendary materials but are limited to 6 per day

| Day | Legendary Spend | Common Spend | Legendary Left | Common Left |
|-----|-----------------|--------------|----------------|-------------|
|   0 |               - |            - |             60 |          64 |
|   1 |               6 |            2 |             54 |          62 |
|   2 |               6 |            2 |             48 |          60 |
|   3 |               6 |            2 |             42 |          58 |
|   4 |               6 |            2 |             36 |          56 |
|   5 |               6 |            2 |             30 |          54 |
|   6 |               6 |            2 |             24 |          52 |
|   7 |               6 |            2 |             18 |          50 |
|   8 |               6 |            2 |             12 |          48 |
|   9 |               6 |            2 |              6 |          46 |
|  10 |               6 |            2 |              0 |          44 |
|  11 |               0 |            8 |              0 |          36 |
|  12 |               0 |            8 |              0 |          28 |
|  13 |               0 |            8 |              0 |          20 |
|  14 |               0 |            8 |              0 |          12 |
|  15 |               0 |            8 |              0 |           4 |
|  16 |               0 |            8 |              0 |           0 |

This has the legendary material ready 6 days before the commons.
If we had deferred some of the legendary farming to later days, we could
have the common materials ready for other upgrades in the meantime.
 
When farming legendary materials for Diamond 2 -> 3 while you're still at a low rank
(e.g. Silver 1), this leaves a lot of days where you're not progressing your character
at all because you're spending all your energy on materials you don't need until much later.

I've played around with this example a bit, and I don't think it's possible
to reduce the total number of days since that's a function of:
```
max(
    ceil(total_energy_needed / daily_energy_budget),
    longest_single_material_days,
)
```

As long as you're using the planner daily to target the current bottleneck material,
I think you'll always end up with the minimum number of days.

I think a good starting point to reduce "dwell time".

1) Determine the number of days needed based on energy required / daily budget
2) Determine the bottleneck material (the one that takes the longest to farm)
3) Does the bottleneck material require the same or more days (rounded down*) than energy allows
   - Farm that material first using all available energy that day
4) Use any remaining energy that day to farm currently needed materials
5) As each day passes, re-evaluate the bottleneck material (goto 1)

\* the rounding down is because the bottleneck days have to fit *inside* the total days

This way, we ensure that we're always making progress towards the goal,
while also ensuring that we address the bottleneck material before it stalls progress.

Here's an example of how that would look in practice using the same numbers as above:
| Day | Legendary Spend | Common Spend | Legendary Left | <- Days | Common Left | Total Left | <- Days|
|-----|-----------------|--------------|----------------|---------|-------------|------------|--------|
|   0 |               - |            - |             60 |      10 |          64 |        124 |   15.5 |
|   1 |               0 |            8 |             60 |      10 |          56 |        116 |   14.5 |
|   2 |               0 |            8 |             60 |      10 |          48 |        108 |   13.5 |
|   3 |               0 |            8 |             60 |      10 |          40 |        100 |   12.5 |
|   4 |               0 |            8 |             60 |      10 |          32 |         92 |   11.5 |
|   5 |               0 |            8 |             60 |      10 |          24 |         84 |   10.5 |
|   6 |               0 |            8 |             60 |      10 |          16 |         76 |   19.5 |
|   7 |               6 |            2 |             54 |       9 |          14 |         68 |    8.5 |
|   8 |               6 |            2 |             48 |       8 |          12 |         60 |    7.5 |
|   9 |               6 |            2 |             42 |       7 |          10 |         52 |    6.5 |
|  10 |               6 |            2 |             36 |       6 |           8 |         44 |    5.5 |
|  11 |               6 |            2 |             30 |       5 |           6 |         36 |    4.5 |
|  12 |               6 |            2 |             24 |       4 |           4 |         28 |    3.5 |
|  13 |               6 |            2 |             18 |       3 |           2 |         20 |    2.5 |
|  14 |               6 |            2 |             12 |       2 |           0 |         12 |    1.5 |
|  15 |               6 |            2 |              6 |       1 |           0 |          4 |    0.5 |
|  16 |               6 |            2 |              0 |       0 |           0 |          0 |      0 |

It gives us the same total number of days, and gets us the materials you want
for current upgrades as early as possible.

Thankfully this doesn't require any complex optimization logic where we plan
out the entire farming schedule in advance.
It's just a day-by-day "Is there a bottleneck material? If so, farm it first. If not, farm whatever you need."
