from datetime import datetime
from dateutil.relativedelta import relativedelta


def calculate_time_interval(created_at, pushed_at):
    # Parse ISO date strings
    start = datetime.fromisoformat(created_at.rstrip("Z"))
    end = datetime.fromisoformat(pushed_at.rstrip("Z"))

    # Calculate time delta
    delta = relativedelta(end, start)

    # Build duration string
    parts = []
    if delta.years: parts.append(f"{delta.years} year{'s' if delta.years > 1 else ''}")
    if delta.months: parts.append(f"{delta.months} month{'s' if delta.months > 1 else ''}")
    if delta.days >= 7:
        weeks = delta.days // 7
        parts.append(f"{weeks} week{'s' if weeks > 1 else ''}")
        delta.days %= 7
    if delta.days: parts.append(f"{delta.days} day{'s' if delta.days > 1 else ''}")

    return " ".join(parts) if parts else "0 days"