import re
from typing import Optional, Dict, Union
import json

contacts = {}
with open("contacts.json", "r") as f:
    contacts = json.load(f)



def parse_cube_acr_filename(filename: str) -> Union[Dict[str, str], bool]:
    pattern = r'^(phone|whatsapp|telegram|viber|skype)[_\-]{1,2}(\d{8})-(\d{6})[_\-]?(\+?\d+)?\.(amr|mp4|wav)$'
    match = re.match(pattern, filename, re.IGNORECASE)

    if not match:
        return False
    source, date, time, number, file_format = match.groups()
    # Extract last 10 digits of number (if available)
    trimmed_number = "Unknown"
    if number:
        digits = re.sub(r'\D', '', number)  # Remove non-digit characters
        trimmed_number = digits[-10:] if len(digits) >= 10 else digits

    label = contacts.get(trimmed_number,trimmed_number)
    return {
        "source": source.lower(),
        "date": f"{date[0:4]}-{date[4:6]}-{date[6:8]}",
        "time": f"{time[0:2]}:{time[2:4]}:{time[4:6]}",
        "number": trimmed_number,
        "format": file_format.lower(),
        "label": label
    }