from collections import Counter
from datetime import time

intervals = {
    "08:00-11:00": (time(8, 0), time(11, 0)),
    "11:00-15:00": (time(11, 0), time(15, 0)),
    "15:00-20:00": (time(15, 0), time(20, 0)),
}

arrivals = [
    time(8, 45),
    time(12, 10),
    time(14, 30),
    time(16, 5),
    time(11, 50),
    time(18, 20),
]

counter = Counter()

for t in arrivals:
    for name, (start, end) in intervals.items():
        if start <= t < end:
            counter[name] += 1
            break

total = sum(counter.values())

prediction = {
    k: round(v / total * 100, 2)
    for k, v in counter.items()
}

print(prediction)

