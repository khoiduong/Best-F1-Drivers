import csv

drivers = {}
with open('data/F1data.csv', encoding="utf-8") as csv_drivers:
    reader = csv.reader(csv_drivers)
    for row in reader:
        if (row[0] == "driverId"):
            continue
        drivers[row[1]] = int(row[0])

print(drivers)