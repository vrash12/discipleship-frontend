import json
import calendar

books = [
    {"book": "Genesis", "chapters": 50},
    {"book": "Exodus", "chapters": 40},
    {"book": "Leviticus", "chapters": 27},
    {"book": "Numbers", "chapters": 36},
    {"book": "Deuteronomy", "chapters": 34},
    {"book": "Joshua", "chapters": 24},
    {"book": "Judges", "chapters": 21},
    {"book": "Ruth", "chapters": 4},
    {"book": "1 Samuel", "chapters": 31},
    {"book": "2 Samuel", "chapters": 24},
    {"book": "1 Kings", "chapters": 22},
    {"book": "2 Kings", "chapters": 25},
    {"book": "1 Chronicles", "chapters": 29},
    {"book": "2 Chronicles", "chapters": 36},
    {"book": "Ezra", "chapters": 10},
    {"book": "Nehemiah", "chapters": 13},
    {"book": "Esther", "chapters": 10},
    {"book": "Job", "chapters": 42},
    {"book": "Isaiah", "chapters": 66},
    {"book": "Jeremiah", "chapters": 52},
    {"book": "Lamentations", "chapters": 5},
    {"book": "Ezekiel", "chapters": 48},
    {"book": "Daniel", "chapters": 12},
    {"book": "Hosea", "chapters": 14},
    {"book": "Joel", "chapters": 3},
    {"book": "Amos", "chapters": 9},
    {"book": "Obadiah", "chapters": 1},
    {"book": "Jonah", "chapters": 4},
    {"book": "Micah", "chapters": 7},
    {"book": "Nahum", "chapters": 3},
    {"book": "Habakkuk", "chapters": 3},
    {"book": "Zephaniah", "chapters": 3},
    {"book": "Haggai", "chapters": 2},
    {"book": "Zechariah", "chapters": 14},
    {"book": "Malachi", "chapters": 4}
]

new_testament_books = [
    {"book": "Matthew", "chapters": 28},
    {"book": "Mark", "chapters": 16},
    {"book": "Luke", "chapters": 24},
    {"book": "John", "chapters": 21},
    {"book": "Acts", "chapters": 28},
    {"book": "Romans", "chapters": 16},
    {"book": "1 Corinthians", "chapters": 16},
    {"book": "2 Corinthians", "chapters": 13},
    {"book": "Galatians", "chapters": 6},
    {"book": "Ephesians", "chapters": 6},
    {"book": "Philippians", "chapters": 4},
    {"book": "Colossians", "chapters": 4},
    {"book": "1 Thessalonians", "chapters": 5},
    {"book": "2 Thessalonians", "chapters": 3},
    {"book": "1 Timothy", "chapters": 6},
    {"book": "2 Timothy", "chapters": 4},
    {"book": "Titus", "chapters": 3},
    {"book": "Philemon", "chapters": 1},
    {"book": "Hebrews", "chapters": 13},
    {"book": "James", "chapters": 5},
    {"book": "1 Peter", "chapters": 5},
    {"book": "2 Peter", "chapters": 3},
    {"book": "1 John", "chapters": 5},
    {"book": "2 John", "chapters": 1},
    {"book": "3 John", "chapters": 1},
    {"book": "Jude", "chapters": 1},
    {"book": "Revelation", "chapters": 22}
]

def generate_reading_plan():
    plan = []
    ot_index = nt_index = 0
    ot_chapter = nt_chapter = 1
    psalm_chapter = 1

    for month in range(1, 13):
        month_name = calendar.month_name[month]
        days_in_month = calendar.monthrange(2024, month)[1]  # Adjust year if needed
        month_plan = {"month": month_name, "days": []}

        for day in range(1, days_in_month + 1):
            daily_reading = {
                "day": day,
                "OT": [],
                "NT": [],
                "Psalm": {"chapter": psalm_chapter}
            }

            # Add 3 OT chapters per day if available
            for _ in range(3):
                if ot_index < len(books):
                    book = books[ot_index]
                    daily_reading["OT"].append({"book": book["book"], "chapter": ot_chapter})
                    ot_chapter += 1
                    if ot_chapter > book["chapters"]:
                        ot_chapter = 1
                        ot_index += 1

            # Add 1 NT chapter per day if available
            if nt_index < len(new_testament_books):
                book = new_testament_books[nt_index]
                daily_reading["NT"].append({"book": book["book"], "chapter": nt_chapter})
                nt_chapter += 1
                if nt_chapter > book["chapters"]:
                    nt_chapter = 1
                    nt_index += 1

            # Cycle Psalms
            psalm_chapter = (psalm_chapter % 150) + 1

            month_plan["days"].append(daily_reading)

        plan.append(month_plan)

    return plan

# Generate the plan and save to a JSON file
reading_plan = generate_reading_plan()
with open("reading_plan.json", "w") as f:
    json.dump(reading_plan, f, indent=2)

print("Month-wise reading plan generated successfully!")
