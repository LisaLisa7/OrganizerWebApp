from googleapiclient.discovery import build
from flask import Flask, jsonify, request
from flask_cors import CORS

import re

app = Flask(__name__)
CORS(app)

api_key_file = 'key.txt'
with open(api_key_file, 'r') as f:
    API_KEY = f.read().strip()

repeat_mapping = {'s': 'Weekly', 'i': 'Odd Week', 'p': 'Even Week'}
type_mapping = {'C': 'Course', 'S': 'Seminar', 'L': 'Laboratory'}


service = build('sheets', 'v4', developerKey=API_KEY)
sheet = service.spreadsheets()


def is_within_merged_ranges(row_idx, col_idx, merges):
    for merge in merges:
        start_row = merge['startRowIndex']
        end_row = merge['endRowIndex']
        start_col = merge['startColumnIndex']
        end_col = merge['endColumnIndex']
        if start_row <= row_idx < end_row and \
            start_col <= col_idx < end_col:
            return True
    return False

def get_value_from_merged_cell(row_idx, col_idx, values, merges):
    for merge in merges:
        start_row = merge['startRowIndex']
        end_row = merge['endRowIndex']
        start_col = merge['startColumnIndex']
        end_col = merge['endColumnIndex']
        if start_row <= row_idx < end_row and start_col <= col_idx < end_col:
            return values[start_row][start_col]
    return ''


def get_rows_below(values, start_row_idx, col_idx,merges):
    rows = []
    for row_idx in range(start_row_idx, len(values)):
        row = values[row_idx]
        #print(row)
        #print(col_idx)
        cell_value = row[col_idx] if len(row) > col_idx else ''
        #print(cell_value)
        if cell_value:
            rows.append((row_idx, cell_value))
        elif is_within_merged_ranges(row_idx, col_idx, merges):
            merged_value = get_value_from_merged_cell(row_idx, col_idx, values, merges)
            rows.append((row_idx, merged_value))
    #print(rows)
    return rows

def find_value_positions(values, search_value):
    positions = []
    for row_idx, row in enumerate(values):
        for col_idx, col_val in enumerate(row):
            if col_val == search_value:
                positions.append((row_idx, col_idx))
    return positions

def get_combined_schedule(values, positions,merges):
    combined_schedule = []
    days_of_week = ["Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday"]
    hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,20]

    for row_idx, col_idx in positions:
        rows_below = get_rows_below(values, row_idx + 1, col_idx,merges)

        for r_idx, course in rows_below:
            day_of_week = None
            time_interval = None
            #print(r_idx)

            if 4 <= r_idx < 64:
                day_index = ((r_idx+1) - 5) // 12
                interval_index = (r_idx+1 - 5) % 12

                if day_index < len(days_of_week):
                    day_of_week = days_of_week[day_index]
                if interval_index < len(hours):
                    time_interval = hours[interval_index]


            if course:
                combined_schedule.append({
                    "day_of_week": day_of_week,
                    "time_interval": time_interval,
                    "course": course
                })
    return combined_schedule


def reduce_intervals(schedule):
    reduced_schedule = []
    schedule.sort(key=lambda x: (x['day_of_week'],
                                 x['course'],
                                 x['time_interval']))

    c_entry = None
    for entry in schedule:
        if c_entry is None:
            c_entry = entry
        elif c_entry['day_of_week'] == entry['day_of_week'] and c_entry['course'] == entry['course']:
            if isinstance(c_entry['time_interval'], str):
                start_hour = int(c_entry['time_interval'].split('-')[0])
                c_entry['time_interval'] = f"{start_hour}" \
                                                 f"-" \
                                                 f"{entry['time_interval'] + 1}"
                continue
            if c_entry['time_interval'] + 1 == entry['time_interval']:
                c_entry['time_interval'] = f"{c_entry['time_interval']}" \
                                                 f"-" \
                                                 f"{entry['time_interval']+1}"
            '''else:
                reduced_schedule.append(c_entry)
                c_entry = entry'''
        else:
            reduced_schedule.append(c_entry)
            c_entry = entry

    if c_entry:
        reduced_schedule.append(c_entry)


    return reduced_schedule



def extract_course_info(entry):
    info = {
        "ClassName": "",
        "Location": "",
        "Type": "",
        "Repeat": "",
        "TimeInterval": "",
        "Day": ""
    }
    nume = ""
    course = entry['course']

    room_pattern = r' ([A-Z0-9-]+)$'
    type_pattern = r' ([CSL]) '
    repeat_pattern = r'[CSLP] ([sip])'

    course_name_pattern = r'^(.*?) \('
    course_abbr_pattern = r'\((.*?)\)'
    lab_course_pattern = r'^([A-Za-z]{2,}\d?)\s'

    room_match = re.search(room_pattern, course)
    type_match = re.search(type_pattern, course)
    repeat_match = re.search(repeat_pattern, course)

    name_match = re.match(course_name_pattern, course)
    abbr_match = re.search(course_abbr_pattern, course)
    lab_match = re.search(lab_course_pattern,course)

    if name_match:
        nume = name_match.group(1)
    elif abbr_match:
        nume = abbr_match.group(1)
    elif lab_match:
        nume = lab_match.group(1)

    info['ClassName'] = nume
    info['TimeInterval'] = entry['time_interval']
    info["Day"] = entry['day_of_week']
    if room_match:
        info['Location'] = room_match.group(1).strip()
    if type_match:
        info['Type'] = type_mapping[type_match.group(1).strip()] if\
                    (type_match.group(1).strip() in type_mapping) else ""
    if repeat_match :
        info['Repeat'] = repeat_mapping[repeat_match.group(1).strip().lower()] if\
            (repeat_match.group(1).strip().lower() in repeat_mapping) else ""
    return info


@app.route('/schedule', methods=['GET'])
def get_schedule():


    spreadsheetid = request.args.get('sheet_id')
    group = request.args.get('group')
    year = request.args.get('year')
    if spreadsheetid == None or group == None or year == None:
        return jsonify('Bad request'), 400
    RANGE_NAME = f'{year}!A1:Q64'

    try:
        result = sheet.values().get(spreadsheetId=spreadsheetid,
                                    range=RANGE_NAME).execute()
    except:
        return jsonify({'error': f"ID '{spreadsheetid}'"
                                 f" not found"}), 404
    values = result.get('values', [])
    spreadsheet_metadata = sheet.get(spreadsheetId=spreadsheetid,
                                     ranges=[RANGE_NAME],
                                     includeGridData=False)\
                                     .execute()
    sheet_metadata = spreadsheet_metadata['sheets'][0]
    merges = sheet_metadata.get('merges', [])

    #print(merges)

    positions = find_value_positions(values, group)
    if not positions:
        return jsonify({'error': f"Group '{group}' not found"}), 404

    combined_schedule = get_combined_schedule(values,
                                              positions,
                                              merges)
    combined_schedule = reduce_intervals(combined_schedule)

    for index, entry in enumerate(combined_schedule):
        combined_schedule[index] = extract_course_info(entry)

    for e in combined_schedule:
        print(e)
    return jsonify(combined_schedule)

if __name__ == '__main__':
    app.run(debug=True)