# Multi-Rank Optimization

TL:DR: Don't try to optimize for multiple ranks at once. Just optimize for the final rank while heading off any bottlenecks as they arise.

---

In the initial optimization document, we treated character progression as a single goal: reaching the final desired rank. However, in practice, players often aim to reach multiple intermediate ranks along the way (e.g., Silver 1, Gold 1, Diamond 1, etc.).

If we just optimize for the final rank, we'll probably fail to tell players ahead of time that there might be materials they should be stockpiling for intermediate ranks.

e.g.
- You have Character A at Gold 3
- You want Character A at Diamond 3
- You need 42 of common materials for Gold 3 -> Diamond 1, no daily limit since they're spread across multiple nodes
- You need 42 of Material X for Diamond 1 -> 2, 6 per day max, taking 7 days to farm
- You need 60 of Material Y for Diamond 2 -> 3, 6 per day max, taking 10 days to farm
- You have an energy budget that allows 12 raids per day
- You need 144 raids total, which takes 12 days based on your energy budget

Here's how the farming schedule would look like using the initial approach:
| Day | Rank | Common Spend | X Spend | Y Spend | Common Left |  X Left |   Y Left | Total Left |
|-----|------|--------------|---------|---------|-------------|---------|----------|------------|
|   0 |   G3 |            - |       - |       - |          42 | 42 (7d) | 60 (10d) |  144 (12d) |
|   1 |   G3 |           12 |       0 |       0 |          30 | 42 (7d) | 60 (10d) |  132 (11d) |
|   2 |   G3 |           12 |       0 |       0 |          18 | 42 (7d) | 60 (10d) |  120 (10d) |
|   3 |   G3 |            6 |       0 |       6 |          12 | 42 (7d) | 54 (9d)  |  108 (9d)  |
|   4 |   G3 |            6 |       0 |       6 |           6 | 42 (7d) | 48 (8d)  |  96 (8d)   |
|   5 |   D1 |            6 |       0 |       6 |           0 | 42 (7d) | 42 (7d)  |  84 (7d)   |
|   6 |   D1 |            0 |       6 |       6 |           0 | 36 (6d) | 36 (6d)  |  72 (6d)   |
|   7 |   D1 |            0 |       6 |       6 |           0 | 30 (5d) | 30 (5d)  |  60 (5d)   |
|   8 |   D1 |            0 |       6 |       6 |           0 | 24 (4d) | 24 (4d)  |  48 (4d)   |
|   9 |   D1 |            0 |       6 |       6 |           0 | 18 (3d) | 18 (3d)  |  36 (3d)   |
|  10 |   D1 |            0 |       6 |       6 |           0 | 12 (2d) | 12 (2d)  |  24 (2d)   |
|  11 |   D1 |            0 |       6 |       6 |           0 |  6 (1d) |  6 (1d)  |  24 (2d)   |
|  12 |   D1 |            0 |       6 |       6 |           0 |  0 (0d) |  0 (0d)  |  0 (0d)    |

By focusing only on the final rank, it delays farming Material Y until as late as possible.
This means you won't have enough of Material Y when you reach Diamond 2 until the very end when you jump all the way to Diamond 3.

To address this, we have to figure out how to optimize for multiple ranks simultaneously.

Here's how the data looks when we crunch the totals for each rank:
G3 -> D1:
- Common: 42
  - Material X: 0 (0 days)
  - Material Y: 0 (0 days)
  - Total: 42 (3.5 days)
  - Bottleneck: Energy (3.5 days)
- G3 -> D2:
  - Common: 42
  - Material X: 42 (7 days)
  - Material Y: 0 (0 days)
  - Total: 84 (7 days)
  - Bottleneck: Material X (7 days)
- G3 -> D3:
  - Common: 42
  - Material X: 42 (7 days)
  - Material Y: 60 (10 days)
  - Total: 144 (12 days)
  - Bottleneck: Energy (12 days)

This tells us that we need to start farming Material X earlier to have enough for the Diamond 1 -> 2 upgrade.
Here's how that would play out in the above example, prioritizing any bottleneck materials for immediate farming:

| Day | Rank | Common Spend | X Spend | Y Spend | D1 Needed |  D2 Needed |   D3 Needed | D1 Bottleneck | D2 Bottleneck | D3 Bottleneck | 
|-----|------|--------------|---------|---------|-----------|------------|-------------|---------------|---------------|---------------|
|   0 |   G3 |            - |       - |       - | 42C,0X,0Y | 42C,42X,0Y | 42C,42X,60Y | energy (3.5d) | X (7d)        |  energy (12d) |
|   1 |   G3 |            6 |       6 |       0 | 36C,0X,0Y | 36C,36X,0Y | 36C,36X,60Y | energy (3d)   | X (6d)        |  energy (11d) |
|   2 |   G3 |            6 |       6 |       0 | 30C,0X,0Y | 30C,30X,0Y | 30C,30X,60Y | energy (2.5d) | X (5d)        |  Y      (10d) |
|   3 |   G3 |            0 |       6 |       6 | 30C,0X,0Y | 30C,24X,0Y | 30C,24X,54Y | energy (2.5d) | X (4d)        |  Y      (9d)  |
|   4 |   G3 |            0 |       6 |       6 | 30C,0X,0Y | 30C,18X,0Y | 30C,18X,48Y | energy (2.5d) | X (3d)        |  Y      (8d)  |
|   5 |   G3 |            0 |       6 |       6 | 30C,0X,0Y | 30C,12X,0Y | 30C,12X,42Y | energy (2.5d) | X (2d)        |  Y      (7d)  |
|   6 |   G3 |            0 |       6 |       6 | 30C,0X,0Y | 30C,6X,0Y  | 30C,6X,36Y  | energy (2.5d) | energy (2.5d) |  Y      (6d)  |
|   7 |   G3 |            6 |       0 |       6 | 24C,0X,0Y | 24C,6X,0Y  | 24C,6X,30Y  | energy (2d)   | energy (2d)   |  Y      (5d)  |
|   8 |   G3 |            6 |       0 |       6 | 18C,0X,0Y | 18C,6X,0Y  | 18C,6X,24Y  | energy (1.5d) | X (1d)        |  Y      (4d)  |
|   9 |   G3 |            0 |       6 |       6 | 18C,0X,0Y | 18C,0X,0Y  | 18C,0X,18Y  | energy (1.5d) | energy (1.5d) |  Y      (3d)  |
|  10 |   G3 |            6 |       0 |       6 | 12C,0X,0Y | 12C,0X,0Y  | 12C,0X,12Y  | energy (1d)   | energy (1d)   |  Y      (2d)  |
|  11 |   G3 |            6 |       0 |       6 | 6C,0X,0Y  | 6C,0X,0Y   | 6C,0X,6Y    | energy (0.5d) | energy (0.5d) |  Y      (1d)  |
|  12 |   G3 |            6 |       0 |       6 | 0C,0X,0Y  | 0C,0X,0Y   | 0C,0X,0Y    | -             | -             |  -            |

Well this is bad... We ended up making it worse, causing us to stay at Gold 3 for the entire duration.

I think the lesson here is that any time we try to optimize for an intermediary rank, it's going to starve earlier ranks of energy.
This pushes out the time spent at earlier ranks, which in turn pushes out the time before reaching the intermediate rank that we were trying to optimize for in the first place. It's a self-defeating cycle.

This suggests the 1st iteration of the optimizer is what we want: "Take a 'mostly greedy' approach, where you optimize for total number of days to the final rank by heading off any bottlenecks but otherwise just farm whatever you need right now".

The usual Tacticus material requirements are there's a single legendary material for each faction where you need dozens of them to reach D3.
Since this bottleneck is so much larger than any intermediary rank requirements, we're unlikely to stack up multiple concurrent bottlenecks.
