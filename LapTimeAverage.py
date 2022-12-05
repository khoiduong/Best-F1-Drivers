import csv


def get_seconds(time_string):
    m, s = time_string.split(':')
    s = float(s)
    return round((float(m) * 60) + float(s), 3)
    # print(f"Min: {m}, Sec: {s}", )

temp = {}

drivers = {}


with open('data/drivers.csv', encoding="utf-8") as csv_drivers:
    reader = csv.reader(csv_drivers)
    for row in reader:
        if (row[0] == "driverId"):
            continue
        drivers[(row[4] + " " + row[5])] = row[0]

with open('data/races.csv', 'r') as csv_races:
    reader = csv.reader(csv_races)
    for row in reader:
        if (row[0] == "raceId"):
            continue
        if (row[1] not in temp):
            temp[row[1]] = []
        temp[row[1]].append(row[0])

while True:
    driver_name = input("\nEnter driver name: ")
    driver_id = 0
    if (len(driver_name) <= 2):
        driver_id = int(input("Enter driver id: "))
    else:
        driver_id = int(drivers[driver_name])
    # year = input("Enter year: ")
    # start = int(input("Enter start: "))
    # end = int(input("Enter end: "))




    # print(temp)
    for year in range(1990, 2023):
        driver = []
        with open('data/results.csv', 'r') as csv_file:
            reader = csv.reader(csv_file)
            for row in reader:
                if (row[0] == "resultId"):
                    continue
                if (row[1] in temp[str(year)] and int(row[2]) == driver_id):
                    driver.append(row[15])

        # print(f"\nBest lap times for {year}")
        # print(driver)

        seconds = []

        for i in driver:
            if i != "\\N":
                seconds.append(get_seconds(i))

        # print("\nConverted to seconds")
        # print(seconds)
        if (sum(seconds) <= 0):
            continue
        print(f"Average Lap Time in {year}: ", end = "")

        print(round(sum(seconds)/len(seconds), 3))



