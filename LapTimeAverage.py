import csv


def get_seconds(time_string):
    m, s = time_string.split(':')
    s = float(s)
    return round((float(m) * 60) + float(s), 3)
    # print(f"Min: {m}, Sec: {s}", )

get_seconds("1:10.392")


driver_id = int(input("Enter driver id: "))
start = int(input("Enter start: "))
end = int(input("Enter end: "))

driver = []
with open('data/results.csv', 'r') as csv_file:
    reader = csv.reader(csv_file)
    for row in reader:
        if (row[0] == "resultId"):
            continue
        if (int(row[1]) >= start and int(row[1]) <= end and int(row[2]) == driver_id):
            driver.append(row[15])

print("\nBest lap times for 2022:")
print(driver)


seconds = []

for i in driver:
    if i != "\\N":
        seconds.append(get_seconds(i))

print("\nConverted to seconds")
print(seconds)

print("\nAverage Lap Time")
print(round(sum(seconds)/len(seconds), 3))



